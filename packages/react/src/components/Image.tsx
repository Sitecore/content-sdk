import { mediaApi } from '@sitecore-content-sdk/content/media';
import React from 'react';
import { addClassName } from '../utils';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentImage } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';
import {
  FieldMetadata,
  isFieldValueEmpty,
  type ImageField,
  type ImageFieldValue,
  type ImageSizeParameters,
} from '@sitecore-content-sdk/content/layout';

/**
 * The interface for the Image component props.
 * @public
 */
export interface ImageProps extends EditableFieldProps<ImageProps> {
  [attributeName: string]: unknown;
  /** Image field data (consistent with other field types) */
  field?: (ImageField | ImageFieldValue) & FieldMetadata;

  /**
   * Parameters that will be attached to Sitecore media URLs
   */
  imageParams?: {
    [paramName: string]: string | number;
  };

  srcSet?: ImageSizeParameters[];

  /**
   * Custom regexp that finds media URL prefix that will be replaced by `/-/jssmedia` or `/~/jssmedia`.
   * @example
   * /\/([-~]{1})assets\//i
   * /-assets/website -> /-/jssmedia/website
   * /~assets/website -> /~/jssmedia/website
   */
  mediaUrlPrefix?: RegExp;

  /** HTML attributes that will be appended to the rendered <img /> tag. */
}

const getImageAttrs = (
  {
    src,
    srcSet,
    ...otherAttrs
  }: {
    [key: string]: unknown;
    src?: string;
    srcSet?: ImageSizeParameters[];
  },
  imageParams?: { [paramName: string]: string | number },
  mediaUrlPrefix?: RegExp
) => {
  if (!src) {
    return null;
  }
  addClassName(otherAttrs);

  const newAttrs: { [attr: string]: unknown } = {
    ...otherAttrs,
  };

  // update image URL for content sdk handler and image rendering params
  const resolvedSrc = mediaApi.updateImageUrl(src, imageParams, mediaUrlPrefix);
  if (srcSet) {
    // replace with HTML-formatted srcset, including updated image URLs
    newAttrs.srcSet = mediaApi.getSrcSet(resolvedSrc, srcSet, imageParams, mediaUrlPrefix);
  }
  // always output original src as fallback for older browsers
  newAttrs.src = resolvedSrc;
  return newAttrs;
};

const ImageComponent: React.FC<ImageProps> = ({
  imageParams,
  field,
  mediaUrlPrefix,
  ...otherProps
}) => {
  const dynamicMedia = field as ImageField | ImageFieldValue;

  if (isFieldValueEmpty(dynamicMedia)) {
    return null;
  }

  delete otherProps.editable; // prevent editable from being passed to the DOM

  // some wise-guy/gal is passing in a 'raw' image object value
  const img = (dynamicMedia as ImageFieldValue).src
    ? field
    : (dynamicMedia.value as ImageFieldValue);
  if (!img) {
    return null;
  }

  // prevent metadata from being passed to the img tag
  if (img.metadata) {
    delete img.metadata;
  }

  const attrs = getImageAttrs({ ...img, ...otherProps }, imageParams, mediaUrlPrefix);
  if (attrs) {
    return <img {...attrs} />;
  }

  return null; // we can't handle the truth
};

/**
 * The Image component.
 * @param {ImageProps} props component props
 * @public
 */
export const Image: React.FC<ImageProps> = withFieldMetadata<ImageProps>(
  withEmptyFieldEditingComponent(ImageComponent, {
    defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentImage,
  })
);

Image.displayName = 'Image';
