import { mediaApi } from '@sitecore-content-sdk/core/media';
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
import NextModule from 'next/image.js';
import {
  isFieldValueEmpty,
  LayoutServicePageState,
  RenderingType,
} from '@sitecore-content-sdk/core/layout';

type NextImageProps = ImageProps & Partial<NextModule.ImageProps>;
export const NextImage: React.FC<NextImageProps> = withFieldMetadata<NextImageProps>(
  withEmptyFieldEditingComponent<NextImageProps>(
    ({ editable = true, imageParams, field, mediaUrlPrefix, fill, priority, ...otherProps }) => {
      const context = React.useContext(SitecoreProviderReactContext);
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

      // disable image optimization for Edit / Preview / Component rendering, but preserve original value if true
      const unoptimized =
        otherProps.unoptimized ||
        context.pageContext?.renderingType === RenderingType.Component ||
        context.pageContext?.pageState !== LayoutServicePageState.Normal;

      const attrs = {
        ...img,
        ...otherProps,
        fill,
        priority,
        src: mediaApi.updateImageUrl(
          img.src as string,
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

      console.log('RENDERING');

      if (attrs) {
        return (
          <NextModule.default
            alt=""
            {...imageProps}
            {...(process.env.TEST ? { 'data-unoptimized': unoptimized } : {})}
          />
        );
      }

      return null; // we can't handle the truth
    },
    { defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentImage }
  )
);

NextImage.displayName = 'NextImage';
