[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / dateFieldSchema

# Function: dateFieldSchema()

> **dateFieldSchema**(`extra?`): `ZodObject`\<\{ `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [packages/react/src/atoms/field-schemas.ts:44](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/react/src/atoms/field-schemas.ts#L44)

Zod schema for a Sitecore Date field.
Mirrors the field shape used in the Date component (`Date.tsx` in `@sitecore-content-sdk/react`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `Readonly`\<\{\[`k`: `string`\]: `$ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\> | Optional additional shape to merge into the schema. |

## Returns

`ZodObject`\<\{ `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

A ZodObject with `value?: string` and the DS control hint attached.
