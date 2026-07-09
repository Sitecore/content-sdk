[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withPropMeta

# Function: withPropMeta()

> **withPropMeta**\<`T`\>(`schema`, `meta`): `T`

Defined in: [packages/react/src/atoms/schema-utils.ts:20](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/react/src/atoms/schema-utils.ts#L20)

Attach editor hint (e.g. control type) to a prop schema. Metadata is stored under a key that
survives JSON Schema conversion for Design Studio.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `schema` | `T` | Zod type for the prop |
| `meta` | [`PropMeta`](../type-aliases/PropMeta.md) | Editor metadata (e.g. control) |

## Returns

`T`

The same Zod type with meta attached (or schema unchanged if .meta is not callable)
