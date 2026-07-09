[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / imageFieldSchema

# Variable: imageFieldSchema

> `const` **imageFieldSchema**: (`extra?`) => `z.ZodObject`\<\{ `value`: `z.ZodOptional`\<`z.ZodObject`\<\{ `alt`: `z.ZodOptional`\<`z.ZodString`\>; `class`: `z.ZodOptional`\<`z.ZodString`\>; `height`: `z.ZodOptional`\<`z.ZodUnion`\<readonly \[`z.ZodString`, `z.ZodNumber`\]\>\>; `src`: `z.ZodOptional`\<`z.ZodString`\>; `width`: `z.ZodOptional`\<`z.ZodUnion`\<readonly \[`z.ZodString`, `z.ZodNumber`\]\>\>; \}, `z.core.$loose`\>\>; \}, `z.core.$strip`\>

Defined in: react/types/atoms/field-schemas.d.ts:64

Zod schema for a Sitecore Image field.
Mirrors the Sitecore Image component (`Image.tsx` in `@sitecore-content-sdk/react`).
The inner value object uses `z.looseObject` to allow arbitrary HTML attributes,
matching the `[attributeName: string]: unknown` index signature on `ImageFieldValue`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `z.ZodRawShape` | Optional additional shape to merge into the outer schema. |

## Returns

`z.ZodObject`\<\{ `value`: `z.ZodOptional`\<`z.ZodObject`\<\{ `alt`: `z.ZodOptional`\<`z.ZodString`\>; `class`: `z.ZodOptional`\<`z.ZodString`\>; `height`: `z.ZodOptional`\<`z.ZodUnion`\<readonly \[`z.ZodString`, `z.ZodNumber`\]\>\>; `src`: `z.ZodOptional`\<`z.ZodString`\>; `width`: `z.ZodOptional`\<`z.ZodUnion`\<readonly \[`z.ZodString`, `z.ZodNumber`\]\>\>; \}, `z.core.$loose`\>\>; \}, `z.core.$strip`\>

A ZodObject with `value?: ImageFieldValue` and the DS control hint attached.
