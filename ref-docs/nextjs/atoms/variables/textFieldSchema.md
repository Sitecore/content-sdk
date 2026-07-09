[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / textFieldSchema

# Variable: textFieldSchema

> `const` **textFieldSchema**: (`extra?`) => `z.ZodObject`\<\{ `value`: `z.ZodOptional`\<`z.ZodUnion`\<readonly \[`z.ZodString`, `z.ZodNumber`\]\>\>; \}, `z.core.$strip`\>

Defined in: react/types/atoms/field-schemas.d.ts:10

Zod schema for a Sitecore Single-Line Text.
Mirrors the Sitecore Text component (`Text.tsx` in `@sitecore-content-sdk/react`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `z.ZodRawShape` | Optional additional shape to merge into the schema. |

## Returns

`z.ZodObject`\<\{ `value`: `z.ZodOptional`\<`z.ZodUnion`\<readonly \[`z.ZodString`, `z.ZodNumber`\]\>\>; \}, `z.core.$strip`\>

A ZodObject with `value?: string | number` and the DS control hint attached.
