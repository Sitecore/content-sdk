import type { FieldMetadata } from './models';

/**
 * The interface for the Link field value.
 * @public
 */
export interface LinkFieldValue {
  [attributeName: string]: unknown;
  href?: string;
  className?: string;
  class?: string;
  title?: string;
  target?: string;
  text?: string;
  anchor?: string;
  querystring?: string;
  linktype?: string;
}

/**
 * The interface for the Link field.
 * @public
 */
export interface LinkField {
  value: LinkFieldValue;
}

/**
 * The interface for the Image field value.
 * @public
 */
export interface ImageFieldValue {
  [attributeName: string]: unknown;
  src?: string;
  /** HTML attributes that will be appended to the rendered <img /> tag. */
}

/**
 * The interface for the Image field.
 * @public
 */
export interface ImageField {
  value?: ImageFieldValue;
}

/**
 * The interface for the Image size parameters.
 * @public
 */
export interface ImageSizeParameters {
  [attr: string]: string | number | undefined;
  /** Fixed width of the image */
  w?: number;
  /** Fixed height of the image */
  h?: number;
  /** Max width of the image */
  mw?: number;
  /** Max height of the image */
  mh?: number;
  /** Ignore aspect ratio */
  iar?: 1 | 0;
  /** Allow stretch */
  as?: 1 | 0;
  /** Image scale. Defaults to 1.0 */
  sc?: number;
}

/**
 * The interface for the Text field.
 * @public
 */
export interface TextField extends FieldMetadata {
  value?: string | number;
}

/**
 * The interface for the Rich Text field.
 * @public
 */
export interface RichTextField extends FieldMetadata {
  value?: string;
}
