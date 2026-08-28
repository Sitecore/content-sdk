[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withPropMeta

# Function: withPropMeta()

> **withPropMeta**\<`T`\>(`schema`, `meta`): `T`

Defined in: [packages/react/src/atoms/schema-utils.ts:20](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/react/src/atoms/schema-utils.ts#L20)

Attach editor hint (e.g. control type, fieldType) to a prop schema. Metadata is stored under a key that
survives JSON Schema conversion for Design Studio.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `schema` | `T` | Zod type for the prop |
| `meta` | [`PropMeta`](../type-aliases/PropMeta.md) | Editor metadata (e.g. control, fieldType) |

## Returns

`T`

The same Zod type with meta attached (or schema unchanged if .meta is not callable)
