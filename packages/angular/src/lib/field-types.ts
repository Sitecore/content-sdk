import { Field, FieldMetadata } from '@sitecore-content-sdk/content/layout';

/**
 * Text field value type.
 * @public
 */
export type TextField = (Field<string | number> | FieldMetadata) & { value?: string | number };

/**
 * RichText field value type.
 * @public
 */
export type RichTextField = (Field<string> | FieldMetadata) & { value?: string };

/**
 * Image field value attributes.
 * @public
 */
export interface ImageFieldValue {
  [key: string]: unknown;
  src?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
}

/**
 * Image field containing an `ImageFieldValue`.
 * @public
 */
export interface ImageField {
  value?: ImageFieldValue;
  metadata?: { [key: string]: unknown };
}

/**
 * Link field value attributes.
 * @public
 */
export interface LinkFieldValue {
  [key: string]: unknown;
  href?: string;
  text?: string;
  title?: string;
  target?: string;
  className?: string;
  class?: string;
  anchor?: string;
  querystring?: string;
  linktype?: string;
}

/**
 * Link field containing a `LinkFieldValue`.
 * @public
 */
export interface LinkField {
  value?: LinkFieldValue;
  metadata?: { [key: string]: unknown };
}

/**
 * File field value attributes.
 * @public
 */
export interface FileFieldValue {
  [key: string]: unknown;
  src?: string;
  title?: string;
  displayName?: string;
}

/**
 * File field containing a `FileFieldValue`.
 * @public
 */
export interface FileField {
  value?: FileFieldValue;
  metadata?: { [key: string]: unknown };
}

/**
 * Date field value type.
 * @public
 */
export type DateFieldType = (Field<string> | FieldMetadata) & { value?: string };
