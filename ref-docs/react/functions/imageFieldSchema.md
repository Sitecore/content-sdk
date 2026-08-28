[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / imageFieldSchema

# Function: imageFieldSchema()

> **imageFieldSchema**(`extra?`): `ZodObject`\<\{ `value`: `ZodOptional`\<`ZodObject`\<\{ `alt`: `ZodOptional`\<`ZodString`\>; `class`: `ZodOptional`\<`ZodString`\>; `height`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; `src`: `ZodOptional`\<`ZodString`\>; `width`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; \}, `$loose`\>\>; \}, `$strip`\>

Defined in: [packages/react/src/atoms/field-schemas.ts:90](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/react/src/atoms/field-schemas.ts#L90)

Zod schema for a Sitecore Image field.
Mirrors the Sitecore Image component (`Image.tsx` in `@sitecore-content-sdk/react`).
The inner value object uses `z.looseObject` to allow arbitrary HTML attributes,
matching the `[attributeName: string]: unknown` index signature on `ImageFieldValue`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `Readonly`\<\{\[`k`: `string`\]: `$ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\> | Optional additional shape to merge into the outer schema. |

## Returns

`ZodObject`\<\{ `value`: `ZodOptional`\<`ZodObject`\<\{ `alt`: `ZodOptional`\<`ZodString`\>; `class`: `ZodOptional`\<`ZodString`\>; `height`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; `src`: `ZodOptional`\<`ZodString`\>; `width`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; \}, `$loose`\>\>; \}, `$strip`\>

A ZodObject with `value?: ImageFieldValue` and DS control/fieldType hints attached.
