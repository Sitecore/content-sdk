[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / isFieldValueEmpty

# Function: isFieldValueEmpty()

> **isFieldValueEmpty**(`field`): `boolean`

<<<<<<< HEAD
Defined in: [packages/core/src/layout/utils.ts:103](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/layout/utils.ts#L103)
=======
Defined in: [packages/core/src/layout/utils.ts:103](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/layout/utils.ts#L103)
>>>>>>> dd686bb50 (Update API docs)

Determines if the passed in field object's value is empty.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `field` | [`GenericFieldValue`](../type-aliases/GenericFieldValue.md) \| `Partial`\<[`Field`](../interfaces/Field.md)\<[`GenericFieldValue`](../type-aliases/GenericFieldValue.md)\>\> | the field object. Partial<T> type is used here because _field.value_ could be required or optional for the different field types |

## Returns

`boolean`
