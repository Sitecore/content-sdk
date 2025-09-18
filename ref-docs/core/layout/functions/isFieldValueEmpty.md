[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / isFieldValueEmpty

# Function: isFieldValueEmpty()

> **isFieldValueEmpty**(`field`): `boolean`

Defined in: [packages/core/src/layout/utils.ts:103](https://github.com/Sitecore/content-sdk/blob/393c51c74a23d0f4ce2431fb5de1ff414fa0d8f0/packages/core/src/layout/utils.ts#L103)

Determines if the passed in field object's value is empty.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`GenericFieldValue`](../type-aliases/GenericFieldValue.md) \| `Partial`\<[`Field`](../interfaces/Field.md)\<[`GenericFieldValue`](../type-aliases/GenericFieldValue.md)\>\> | the field object. Partial<T> type is used here because _field.value_ could be required or optional for the different field types |

## Returns

`boolean`
