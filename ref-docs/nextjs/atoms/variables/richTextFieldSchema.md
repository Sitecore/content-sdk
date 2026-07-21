[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / richTextFieldSchema

# Variable: richTextFieldSchema

> `const` **richTextFieldSchema**: (`extra?`) => `z.ZodObject`\<\{ `value`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$strip`\>

Defined in: react/types/atoms/field-schemas.d.ts:20

Zod schema for a Sitecore Rich Text field.
Mirrors the Sitecore Rich Text component (`RichText.tsx` in `@sitecore-content-sdk/react`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `z.ZodRawShape` | Optional additional shape to merge into the schema. |

## Returns

`z.ZodObject`\<\{ `value`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$strip`\>

A ZodObject with `value?: string` and DS control/fieldType hints attached.
