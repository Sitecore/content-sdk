[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / fileFieldSchema

# Function: fileFieldSchema()

> **fileFieldSchema**(`extra?`): `ZodObject`\<\{ `value`: `ZodObject`\<\{ `displayName`: `ZodOptional`\<`ZodString`\>; `src`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; \}, `$loose`\>; \}, `$strip`\>

Defined in: [packages/react/src/atoms/field-schemas.ts:116](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/react/src/atoms/field-schemas.ts#L116)

Zod schema for a Sitecore File field.
Mirrors the Sitecore File component (`File.tsx` in `@sitecore-content-sdk/react`).
The inner value object uses `z.looseObject` to allow arbitrary extra properties,
matching the `[propName: string]: unknown` index signature on `FileFieldValue`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `Readonly`\<\{\[`k`: `string`\]: `$ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\> | Optional additional shape to merge into the outer schema. |

## Returns

`ZodObject`\<\{ `value`: `ZodObject`\<\{ `displayName`: `ZodOptional`\<`ZodString`\>; `src`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; \}, `$loose`\>; \}, `$strip`\>

A ZodObject with `value: FileFieldValue` and DS control/fieldType hints attached.
