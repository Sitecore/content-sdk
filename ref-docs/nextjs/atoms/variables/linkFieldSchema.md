[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / linkFieldSchema

# Variable: linkFieldSchema

> `const` **linkFieldSchema**: (`extra?`) => `z.ZodObject`\<\{ `value`: `z.ZodObject`\<\{ `anchor`: `z.ZodOptional`\<`z.ZodString`\>; `class`: `z.ZodOptional`\<`z.ZodString`\>; `className`: `z.ZodOptional`\<`z.ZodString`\>; `href`: `z.ZodOptional`\<`z.ZodString`\>; `linktype`: `z.ZodOptional`\<`z.ZodString`\>; `querystring`: `z.ZodOptional`\<`z.ZodString`\>; `target`: `z.ZodOptional`\<`z.ZodString`\>; `text`: `z.ZodOptional`\<`z.ZodString`\>; `title`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$loose`\>; \}, `z.core.$strip`\>

Defined in: react/types/atoms/field-schemas.d.ts:42

Zod schema for a Sitecore Link field.
Mirrors the Sitecore Link component (`Link.tsx` in `@sitecore-content-sdk/react`).
The inner value object uses `z.looseObject` to allow arbitrary Sitecore-added attributes,
matching the `[attributeName: string]: unknown` index signature on `LinkFieldValue`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `z.ZodRawShape` | Optional additional shape to merge into the outer schema. |

## Returns

`z.ZodObject`\<\{ `value`: `z.ZodObject`\<\{ `anchor`: `z.ZodOptional`\<`z.ZodString`\>; `class`: `z.ZodOptional`\<`z.ZodString`\>; `className`: `z.ZodOptional`\<`z.ZodString`\>; `href`: `z.ZodOptional`\<`z.ZodString`\>; `linktype`: `z.ZodOptional`\<`z.ZodString`\>; `querystring`: `z.ZodOptional`\<`z.ZodString`\>; `target`: `z.ZodOptional`\<`z.ZodString`\>; `text`: `z.ZodOptional`\<`z.ZodString`\>; `title`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$loose`\>; \}, `z.core.$strip`\>

A ZodObject with `value: LinkFieldValue` and the DS control hint attached.
