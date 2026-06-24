[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / isFieldValueEmpty

# Function: isFieldValueEmpty()

> **isFieldValueEmpty**(`field`): field is null \| undefined

Defined in: [content/src/layout/utils.ts:164](https://github.com/Sitecore/content-sdk/blob/0c9c85549b17bf9449ad041cf3a48f33666a0472/packages/content/src/layout/utils.ts#L164)

Determines if the passed in field object's value is empty.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`GenericFieldValue`](../type-aliases/GenericFieldValue.md) \| `Partial`\<[`Field`](../interfaces/Field.md)\<[`GenericFieldValue`](../type-aliases/GenericFieldValue.md)\>\> \| `null` \| `undefined` | the field object. Partial<T> type is used here because _field.value_ could be required or optional for the different field types |

## Returns

field is null \| undefined

True if the field value is empty
