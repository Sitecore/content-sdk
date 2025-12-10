[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / getFieldValue

# Function: getFieldValue()

## Call Signature

> **getFieldValue**\<`T`\>(`renderingOrFields`, `fieldName`): `T` \| `undefined`

Defined in: packages/core/types/layout/utils.d.ts:10

Safely extracts a field value from a rendering or fields object.
Null will be returned if the field is not defined.

### Type Parameters

| Type Parameter |
| ------ |
| `T` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderingOrFields` | [`ComponentFields`](../interfaces/ComponentFields.md) \| [`ComponentRendering`](../interfaces/ComponentRendering.md)\<[`ComponentFields`](../interfaces/ComponentFields.md)\> | the rendering or fields object to extract the field from |
| `fieldName` | `string` | the name of the field to extract |

### Returns

`T` \| `undefined`

the field value or null if the field is not defined

## Call Signature

> **getFieldValue**\<`T`\>(`renderingOrFields`, `fieldName`, `defaultValue`): `T`

Defined in: packages/core/types/layout/utils.d.ts:19

Safely extracts a field value from a rendering or fields object.

### Type Parameters

| Type Parameter |
| ------ |
| `T` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderingOrFields` | [`ComponentFields`](../interfaces/ComponentFields.md) \| [`ComponentRendering`](../interfaces/ComponentRendering.md)\<[`ComponentFields`](../interfaces/ComponentFields.md)\> | the rendering or fields object to extract the field from |
| `fieldName` | `string` | the name of the field to extract |
| `defaultValue` | `T` | the default value to return if the field is not defined |

### Returns

`T`

the field value or the default value if the field is not defined
