import { mediaApi } from '@sitecore-content-sdk/core/media';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import {
  ImageProps,
  ImageField,
  ImageFieldValue,
  withFieldMetadata,
  SitecoreContextReactContext,
} from '@sitecore-content-sdk/react';
import Image, { ImageProps as NextImageProperties } from 'next/image';
import { withEmptyFieldEditingComponent } from '@sitecore-content-sdk/react';
import { DefaultEmptyFieldEditingComponentImage } from '@sitecore-content-sdk/react';
import {
  isFieldValueEmpty,
  LayoutServicePageState,
} from '@sitecore-content-sdk/core/layout';

type NextImageProps = ImageProps & Partial<NextImageProperties>;
export const NextImage: React.FC<NextImageProps> = withFieldMetadata<NextImageProps>(
  withEmptyFieldEditingComponent<NextImageProps>(
    ({ editable = true, imageParams, field, mediaUrlPrefix, fill, priority, ...otherProps }) => {
      const sitecoreContext = React.useContext(SitecoreContextReactContext);
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

      // disable image optimization for Edit and Preview, but preserve original value if true
      const unoptimized =
        otherProps.unoptimized ||
        sitecoreContext.context?.pageState !== LayoutServicePageState.Normal;

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

      if (attrs) {
        return (
          <Image
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

NextImage.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.shape({
      src: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      value: PropTypes.object,
    }),
  ]),
  editable: PropTypes.bool,
  mediaUrlPrefix: PropTypes.instanceOf(RegExp),
  imageParams: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]).isRequired
  ),
  emptyFieldEditingComponent: PropTypes.oneOfType([
    PropTypes.object as Requireable<React.ComponentClass<unknown>>,
    PropTypes.func as Requireable<React.FC<unknown>>,
  ]),
};

NextImage.displayName = 'NextImage';
