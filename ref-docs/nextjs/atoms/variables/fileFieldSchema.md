[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / fileFieldSchema

# Variable: fileFieldSchema

> `const` **fileFieldSchema**: (`extra?`) => `z.ZodObject`\<\{ `value`: `z.ZodObject`\<\{ `displayName`: `z.ZodOptional`\<`z.ZodString`\>; `src`: `z.ZodOptional`\<`z.ZodString`\>; `title`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$loose`\>; \}, `z.core.$strip`\>

Defined in: react/types/atoms/field-schemas.d.ts:82

Zod schema for a Sitecore File field.
Mirrors the Sitecore File component (`File.tsx` in `@sitecore-content-sdk/react`).
The inner value object uses `z.looseObject` to allow arbitrary extra properties,
matching the `[propName: string]: unknown` index signature on `FileFieldValue`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `z.ZodRawShape` | Optional additional shape to merge into the outer schema. |

## Returns

`z.ZodObject`\<\{ `value`: `z.ZodObject`\<\{ `displayName`: `z.ZodOptional`\<`z.ZodString`\>; `src`: `z.ZodOptional`\<`z.ZodString`\>; `title`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$loose`\>; \}, `z.core.$strip`\>

A ZodObject with `value: FileFieldValue` and the DS control hint attached.
