[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getFieldValue

# Function: getFieldValue()

## Param

**renderingOrFields**

the rendering or fields object to extract the field from

## Param

**fieldName**

the name of the field to extract

## Param

**defaultValue**

the default value to return if the field is not defined

## Call Signature

> **getFieldValue**\<`T`\>(`renderingOrFields`, `fieldName`): `T` \| `undefined`

Defined in: [content/src/layout/utils.ts:57](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/content/src/layout/utils.ts#L57)

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

Defined in: [content/src/layout/utils.ts:69](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/content/src/layout/utils.ts#L69)

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
