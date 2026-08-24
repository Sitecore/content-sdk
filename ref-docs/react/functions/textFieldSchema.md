[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / textFieldSchema

# Function: textFieldSchema()

> **textFieldSchema**(`extra?`): `ZodObject`\<\{ `value`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; \}, `$strip`\>

Defined in: [packages/react/src/atoms/field-schemas.ts:12](https://github.com/Sitecore/content-sdk/blob/983922d9befd808bfc886e48936661b9e7afa003/packages/react/src/atoms/field-schemas.ts#L12)

Zod schema for a Sitecore Single-Line Text.
Mirrors the Sitecore Text component (`Text.tsx` in `@sitecore-content-sdk/react`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `Readonly`\<\{\[`k`: `string`\]: `$ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\> | Optional additional shape to merge into the schema. |

## Returns

`ZodObject`\<\{ `value`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; \}, `$strip`\>

A ZodObject with `value?: string | number` and DS control/fieldType hints attached.
