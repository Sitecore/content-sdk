[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / dateFieldSchema

# Variable: dateFieldSchema

> `const` **dateFieldSchema**: (`extra?`) => `z.ZodObject`\<\{ `value`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$strip`\>

Defined in: react/types/atoms/field-schemas.d.ts:30

Zod schema for a Sitecore Date field.
Mirrors the field shape used in the Date component (`Date.tsx` in `@sitecore-content-sdk/react`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `z.ZodRawShape` | Optional additional shape to merge into the schema. |

## Returns

`z.ZodObject`\<\{ `value`: `z.ZodOptional`\<`z.ZodString`\>; \}, `z.core.$strip`\>

A ZodObject with `value?: string` and DS control/fieldType hints attached.
