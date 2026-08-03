[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / richTextFieldSchema

# Function: richTextFieldSchema()

> **richTextFieldSchema**(`extra?`): `ZodObject`\<\{ `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [packages/react/src/atoms/field-schemas.ts:28](https://github.com/Sitecore/content-sdk/blob/67aa52ba0cee57732483f58d187367f0b89f05a1/packages/react/src/atoms/field-schemas.ts#L28)

Zod schema for a Sitecore Rich Text field.
Mirrors the Sitecore Rich Text component (`RichText.tsx` in `@sitecore-content-sdk/react`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `Readonly`\<\{\[`k`: `string`\]: `$ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\> | Optional additional shape to merge into the schema. |

## Returns

`ZodObject`\<\{ `value`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

A ZodObject with `value?: string` and DS control/fieldType hints attached.
