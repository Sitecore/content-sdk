[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / getFieldValue

# Function: getFieldValue()

## Param

the rendering or fields object to extract the field from

## Param

the name of the field to extract

## Param

the default value to return if the field is not defined

## Call Signature

> **getFieldValue**\<`T`\>(`renderingOrFields`, `fieldName`): `T` \| `undefined`

Defined in: [packages/core/src/layout/utils.ts:10](https://github.com/Sitecore/content-sdk/blob/a12743cf942dfe3195e858aea63c33d67943078b/packages/core/src/layout/utils.ts#L10)

Safely extracts a field value from a rendering or fields object.
Null will be returned if the field is not defined.

### Type Parameters

| Type Parameter |
| ------ |
| `T` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderingOrFields` | [`ComponentFields`](../interfaces/ComponentFields.md) \| [`ComponentRendering`](../interfaces/ComponentRendering.md) | the rendering or fields object to extract the field from |
| `fieldName` | `string` | the name of the field to extract |

### Returns

`T` \| `undefined`

the field value or the default value if the field is not defined

the field value or null if the field is not defined

### Param

the rendering or fields object to extract the field from

### Param

the name of the field to extract

### Param

the default value to return if the field is not defined

## Call Signature

> **getFieldValue**\<`T`\>(`renderingOrFields`, `fieldName`, `defaultValue`): `T`

Defined in: [packages/core/src/layout/utils.ts:15](https://github.com/Sitecore/content-sdk/blob/a12743cf942dfe3195e858aea63c33d67943078b/packages/core/src/layout/utils.ts#L15)

Safely extracts a field value from a rendering or fields object.
Null will be returned if the field is not defined.

### Type Parameters

| Type Parameter |
| ------ |
| `T` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderingOrFields` | [`ComponentFields`](../interfaces/ComponentFields.md) \| [`ComponentRendering`](../interfaces/ComponentRendering.md) | the rendering or fields object to extract the field from |
| `fieldName` | `string` | the name of the field to extract |
| `defaultValue` | `T` | - |

### Returns

`T`

the field value or the default value if the field is not defined

the field value or null if the field is not defined

### Param

the rendering or fields object to extract the field from

### Param

the name of the field to extract

### Param

the default value to return if the field is not defined
