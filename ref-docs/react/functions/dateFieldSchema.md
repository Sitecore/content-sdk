[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / dateFieldSchema

# Function: dateFieldSchema()

> **dateFieldSchema**(`extra?`): `ZodObject`\<\{ `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [packages/react/src/atoms/field-schemas.ts:44](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/react/src/atoms/field-schemas.ts#L44)

Zod schema for a Sitecore Date field.
Mirrors the field shape used in the Date component (`Date.tsx` in `@sitecore-content-sdk/react`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `Readonly`\<\{\[`k`: `string`\]: `$ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\> | Optional additional shape to merge into the schema. |

## Returns

`ZodObject`\<\{ `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

A ZodObject with `value?: string` and DS control/fieldType hints attached.
