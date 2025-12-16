[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / isFieldValueEmpty

# Function: isFieldValueEmpty()

> **isFieldValueEmpty**(`field`): field is null \| undefined

Defined in: [packages/core/src/layout/utils.ts:119](https://github.com/Sitecore/content-sdk/blob/6eb16655f677d9f2c9f82dbf67e6f8a92dd58ada/packages/core/src/layout/utils.ts#L119)

Determines if the passed in field object's value is empty.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`GenericFieldValue`](../type-aliases/GenericFieldValue.md) \| `Partial`\<[`Field`](../interfaces/Field.md)\<[`GenericFieldValue`](../type-aliases/GenericFieldValue.md)\>\> \| `null` \| `undefined` | the field object. Partial<T> type is used here because _field.value_ could be required or optional for the different field types |

## Returns

field is null \| undefined

True if the field value is empty
