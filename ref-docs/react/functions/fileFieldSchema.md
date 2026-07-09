[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / fileFieldSchema

# Function: fileFieldSchema()

> **fileFieldSchema**(`extra?`): `ZodObject`\<\{ `value`: `ZodObject`\<\{ `displayName`: `ZodOptional`\<`ZodString`\>; `src`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; \}, `$loose`\>; \}, `$strip`\>

Defined in: [packages/react/src/atoms/field-schemas.ts:116](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/react/src/atoms/field-schemas.ts#L116)

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

A ZodObject with `value: FileFieldValue` and the DS control hint attached.
