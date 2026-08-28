[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / linkFieldSchema

# Function: linkFieldSchema()

> **linkFieldSchema**(`extra?`): `ZodObject`\<\{ `value`: `ZodObject`\<\{ `anchor`: `ZodOptional`\<`ZodString`\>; `class`: `ZodOptional`\<`ZodString`\>; `className`: `ZodOptional`\<`ZodString`\>; `href`: `ZodOptional`\<`ZodString`\>; `linktype`: `ZodOptional`\<`ZodString`\>; `querystring`: `ZodOptional`\<`ZodString`\>; `target`: `ZodOptional`\<`ZodString`\>; `text`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; \}, `$loose`\>; \}, `$strip`\>

Defined in: [packages/react/src/atoms/field-schemas.ts:62](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/react/src/atoms/field-schemas.ts#L62)

Zod schema for a Sitecore Link field.
Mirrors the Sitecore Link component (`Link.tsx` in `@sitecore-content-sdk/react`).
The inner value object uses `z.looseObject` to allow arbitrary Sitecore-added attributes,
matching the `[attributeName: string]: unknown` index signature on `LinkFieldValue`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `extra?` | `Readonly`\<\{\[`k`: `string`\]: `$ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\> | Optional additional shape to merge into the outer schema. |

## Returns

`ZodObject`\<\{ `value`: `ZodObject`\<\{ `anchor`: `ZodOptional`\<`ZodString`\>; `class`: `ZodOptional`\<`ZodString`\>; `className`: `ZodOptional`\<`ZodString`\>; `href`: `ZodOptional`\<`ZodString`\>; `linktype`: `ZodOptional`\<`ZodString`\>; `querystring`: `ZodOptional`\<`ZodString`\>; `target`: `ZodOptional`\<`ZodString`\>; `text`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; \}, `$loose`\>; \}, `$strip`\>

A ZodObject with `value: LinkFieldValue` and DS control/fieldType hints attached.
