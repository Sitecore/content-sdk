[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / isFieldValueEmpty

# Function: isFieldValueEmpty()

> **isFieldValueEmpty**(`field`): field is undefined \| null

Defined in: [packages/core/src/layout/utils.ts:119](https://github.com/Sitecore/content-sdk/blob/ea905f88f4dfeb082edef85ad5a67c03322f2c71/packages/core/src/layout/utils.ts#L119)

Determines if the passed in field object's value is empty.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | `undefined` \| `null` \| [`GenericFieldValue`](../type-aliases/GenericFieldValue.md) \| `Partial`\<[`Field`](../interfaces/Field.md)\<[`GenericFieldValue`](../type-aliases/GenericFieldValue.md)\>\> | the field object. Partial<T> type is used here because _field.value_ could be required or optional for the different field types |

## Returns

field is undefined \| null

True if the field value is empty
