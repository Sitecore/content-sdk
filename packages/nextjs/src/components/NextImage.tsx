'use client';
/* eslint-disable no-unused-vars */
import { mediaApi } from '@sitecore-content-sdk/content/media';
import React from 'react';
import {
  ImageProps,
  ImageField,
  ImageFieldValue,
  withFieldMetadata,
  SitecoreProviderReactContext,
  DefaultEmptyFieldEditingComponentImage,
  withEmptyFieldEditingComponent,
} from '@sitecore-content-sdk/react';
import Image, { getImageProps, ImageProps as NextImageProperties } from 'next/image';
import { ImageConfigContext } from 'next/dist/shared/lib/image-config-context.shared-runtime';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { canSafelyResolveNextImageProps, cloneNextImageConfig } from './next-image-utils';

type NextImageProps = ImageProps & Partial<NextImageProperties>;

type NativeImageFallbackProps = {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  sizes?: string;
  loading?: React.ImgHTMLAttributes<HTMLImageElement>['loading'];
  fetchPriority?: React.ImgHTMLAttributes<HTMLImageElement>['fetchPriority'];
};

/**
 * Native `img` used when `next/image` cannot sort frozen `deviceSizes` / `qualities`
 * (Next.js 16 production SSR on Vercel / Node 24).
 * @param {NativeImageFallbackProps} props - Sitecore-resolved image attributes.
 * @returns {React.JSX.Element} A native img element.
 */
const NativeImageFallback = ({
  src,
  alt = '',
  width,
  height,
  fill,
  priority,
  className,
  id,
  style,
  sizes,
  loading,
  fetchPriority,
}: NativeImageFallbackProps) => (
  <img
    alt={alt}
    src={src}
    width={fill ? undefined : width}
    height={fill ? undefined : height}
    className={className}
    id={id}
    sizes={sizes}
    loading={loading ?? (priority ? 'eager' : 'lazy')}
    fetchPriority={fetchPriority ?? (priority ? 'high' : undefined)}
    style={
      fill
        ? {
            position: 'absolute',
            height: '100%',
            width: '100%',
            inset: 0,
            ...style,
          }
        : style
    }
  />
);

/**
 * Next.js specific Image component implementation.
 * @public
 */
export const NextImage: React.FC<NextImageProps> = withFieldMetadata<NextImageProps>(
  withEmptyFieldEditingComponent<NextImageProps>(
    ({ editable = true, imageParams, field, mediaUrlPrefix, fill, priority, ...otherProps }) => {
      const context = React.useContext(SitecoreProviderReactContext);
      const imageConfig = React.useContext(ImageConfigContext);
      const mutableImageConfig = React.useMemo(
        () => cloneNextImageConfig(imageConfig),
        [imageConfig]
      );
      // next handles src and we use a custom loader,
      // throw error if these are present
      if (otherProps.src) {
        throw new Error('Detected src prop. If you wish to use src, use next/image directly.');
      }

      const dynamicMedia = field as ImageField | ImageFieldValue;

      if (isFieldValueEmpty(dynamicMedia)) {
        return null;
      }

      // some wise-guy/gal is passing in a 'raw' image object value
      const img: ImageFieldValue = (dynamicMedia as ImageFieldValue).src
        ? (field as ImageFieldValue)
        : (dynamicMedia.value as ImageFieldValue);
      if (!img) {
        return null;
      }

      // Shallow-clone so we never mutate frozen layout/field objects from ISR cache.
      const imgValue: ImageFieldValue = { ...img };

      // disable image optimization for Edit / Preview / Component rendering, but preserve original value if true
      const unoptimized = otherProps.unoptimized || !context.page.mode.isNormal;

      const attrs = {
        ...imgValue,
        ...otherProps,
        fill,
        priority,
        src: mediaApi.updateImageUrl(
          imgValue.src as string,
          imageParams as { [paramName: string]: string | number },
          mediaUrlPrefix as RegExp
        ),
        unoptimized,
      };

      const imageProps = {
        ...attrs,
        // force replace /media with /jssmedia in src since we _know_ we will be adding a 'mw' query string parameter
        // this is required for Sitecore media API resizing to work properly
        src: mediaApi.replaceMediaUrlPrefix(attrs.src, mediaUrlPrefix as RegExp),
      };

      // Exclude `width`, `height` in case image is responsive, `fill` is used
      if (imageProps.fill) {
        delete imageProps.width;
        delete imageProps.height;
      }

      if (!attrs) {
        return null; // we can't handle the truth
      }

      const useNextImage = canSafelyResolveNextImageProps(() => {
        getImageProps({
          src: imageProps.src,
          alt: (imageProps.alt as string) || '',
          width: imageProps.fill ? undefined : (imageProps.width as number | undefined),
          height: imageProps.fill ? undefined : (imageProps.height as number | undefined),
          fill: imageProps.fill,
          sizes: imageProps.sizes as string | undefined,
          unoptimized,
        });
      });

      const renderedImage = useNextImage ? (
        <Image
          alt=""
          {...imageProps}
          {...(process.env.TEST ? { 'data-unoptimized': unoptimized } : {})}
        />
      ) : (
        <NativeImageFallback
          src={imageProps.src}
          alt={(imageProps.alt as string) || ''}
          width={imageProps.width as string | number | undefined}
          height={imageProps.height as string | number | undefined}
          fill={imageProps.fill}
          priority={imageProps.priority}
          className={imageProps.className as string | undefined}
          id={imageProps.id as string | undefined}
          style={imageProps.style as React.CSSProperties | undefined}
          sizes={imageProps.sizes as string | undefined}
          loading={
            imageProps.loading as React.ImgHTMLAttributes<HTMLImageElement>['loading'] | undefined
          }
          fetchPriority={
            imageProps.fetchPriority as
              | React.ImgHTMLAttributes<HTMLImageElement>['fetchPriority']
              | undefined
          }
        />
      );

      // Re-provide cloned arrays so next/image's in-place `.sort()` does not throw when
      // it reads config from context (configEnv from `__NEXT_IMAGE_OPTS` still needs the fallback).
      return (
        <ImageConfigContext.Provider value={mutableImageConfig}>
          {renderedImage}
        </ImageConfigContext.Provider>
      );
    },
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentImage }
  )
);

NextImage.displayName = 'NextImage';
