/** Zod schemas for Sitecore field types, for use in createAtom prop definitions. */
import { z } from 'zod';
import { withPropMeta } from './schema-utils';

/**
 * Zod schema for a Sitecore Single-Line Text or Multi-Line Text field.
 * Mirrors the Sitecore Text component (`Text.tsx` in `@sitecore-content-sdk/react`).
 * @param {z.ZodRawShape} [extra] - Optional additional shape to merge into the schema.
 * @returns A ZodObject with `value?: string | number` and the DS control hint attached.
 * @public
 */
export const textFieldSchema = (extra?: z.ZodRawShape) =>
  withPropMeta(
    z.object({
      value: z.union([z.string(), z.number()]).optional(),
      ...extra,
    }),
    { control: 'Single-Line Text' }
  );

/**
 * Zod schema for a Sitecore Rich Text field.
 * Mirrors the Sitecore Rich Text component (`RichText.tsx` in `@sitecore-content-sdk/react`).
 * @param {z.ZodRawShape} [extra] - Optional additional shape to merge into the schema.
 * @returns A ZodObject with `value?: string` and the DS control hint attached.
 * @public
 */
export const richTextFieldSchema = (extra?: z.ZodRawShape) =>
  withPropMeta(
    z.object({
      value: z.string().optional(),
      ...extra,
    }),
    { control: 'Rich Text' }
  );

/**
 * Zod schema for a Sitecore Date field.
 * Mirrors the field shape used in the Date component (`Date.tsx` in `@sitecore-content-sdk/react`).
 * @param {z.ZodRawShape} [extra] - Optional additional shape to merge into the schema.
 * @returns A ZodObject with `value?: string` and the DS control hint attached.
 * @public
 */
export const dateFieldSchema = (extra?: z.ZodRawShape) =>
  withPropMeta(
    z.object({
      value: z.string().optional(),
      ...extra,
    }),
    { control: 'Date' }
  );

/**
 * Zod schema for a Sitecore Link field.
 * Mirrors the Sitecore Link component (`Link.tsx` in `@sitecore-content-sdk/react`).
 * The inner value object uses `z.looseObject` to allow arbitrary Sitecore-added attributes,
 * matching the `[attributeName: string]: unknown` index signature on `LinkFieldValue`.
 * @param {z.ZodRawShape} [extra] - Optional additional shape to merge into the outer schema.
 * @returns A ZodObject with `value: LinkFieldValue` and the DS control hint attached.
 * @public
 */
export const linkFieldSchema = (extra?: z.ZodRawShape) =>
  withPropMeta(
    z.object({
      value: z.looseObject({
        href: z.string().optional(),
        className: z.string().optional(),
        class: z.string().optional(),
        title: z.string().optional(),
        target: z.string().optional(),
        text: z.string().optional(),
        anchor: z.string().optional(),
        querystring: z.string().optional(),
        linktype: z.string().optional(),
      }),
      ...extra,
    }),
    { control: 'Link' }
  );

/**
 * Zod schema for a Sitecore Image field.
 * Mirrors the Sitecore Image component (`Image.tsx` in `@sitecore-content-sdk/react`).
 * The inner value object uses `z.looseObject` to allow arbitrary HTML attributes,
 * matching the `[attributeName: string]: unknown` index signature on `ImageFieldValue`.
 * @param {z.ZodRawShape} [extra] - Optional additional shape to merge into the outer schema.
 * @returns A ZodObject with `value?: ImageFieldValue` and the DS control hint attached.
 * @public
 */
export const imageFieldSchema = (extra?: z.ZodRawShape) =>
  withPropMeta(
    z.object({
      value: z
        .looseObject({
          src: z.string().optional(),
          alt: z.string().optional(),
          width: z.union([z.string(), z.number()]).optional(),
          height: z.union([z.string(), z.number()]).optional(),
          class: z.string().optional(),
        })
        .optional(),
      ...extra,
    }),
    { control: 'Image' }
  );

/**
 * Zod schema for a Sitecore File field.
 * Mirrors the Sitecore File component (`File.tsx` in `@sitecore-content-sdk/react`).
 * The inner value object uses `z.looseObject` to allow arbitrary extra properties,
 * matching the `[propName: string]: unknown` index signature on `FileFieldValue`.
 * @param {z.ZodRawShape} [extra] - Optional additional shape to merge into the outer schema.
 * @returns A ZodObject with `value: FileFieldValue` and the DS control hint attached.
 * @public
 */
export const fileFieldSchema = (extra?: z.ZodRawShape) =>
  withPropMeta(
    z.object({
      value: z.looseObject({
        src: z.string().optional(),
        title: z.string().optional(),
        displayName: z.string().optional(),
      }),
      ...extra,
    }),
    { control: 'File' }
  );

/**
 * Inferred type for a Sitecore Single-Line Text / Multi-Line Text field prop.
 * Use this to type component props that accept a text field.
 * @example
 * const MyComponent = (props: { title: TextFieldSchema }) => ...
 * @public
 */
export type TextFieldSchema = z.infer<ReturnType<typeof textFieldSchema>>;

/**
 * Inferred type for a Sitecore Rich Text field prop.
 * @example
 * const MyComponent = (props: { body: RichTextFieldSchema }) => ...
 * @public
 */
export type RichTextFieldSchema = z.infer<ReturnType<typeof richTextFieldSchema>>;

/**
 * Inferred type for a Sitecore Date field prop.
 * @example
 * const MyComponent = (props: { publishedAt: DateFieldSchema }) => ...
 * @public
 */
export type DateFieldSchema = z.infer<ReturnType<typeof dateFieldSchema>>;

/**
 * Inferred type for a Sitecore General Link field prop.
 * @example
 * const MyComponent = (props: { cta: LinkFieldSchema }) => ...
 * @public
 */
export type LinkFieldSchema = z.infer<ReturnType<typeof linkFieldSchema>>;

/**
 * Inferred type for a Sitecore Image field prop.
 * @example
 * const MyComponent = (props: { image: ImageFieldSchema }) => ...
 * @public
 */
export type ImageFieldSchema = z.infer<ReturnType<typeof imageFieldSchema>>;

/**
 * Inferred type for a Sitecore File field prop.
 * @example
 * const MyComponent = (props: { doc: FileFieldSchema }) => ...
 * @public
 */
export type FileFieldSchema = z.infer<ReturnType<typeof fileFieldSchema>>;

