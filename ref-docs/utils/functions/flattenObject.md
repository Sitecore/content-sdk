[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / flattenObject

# Function: flattenObject()

> **flattenObject**(`data`): [`FlattenedObject`](../interfaces/FlattenedObject.md)

Defined in: [converters/flatten-object.ts:14](https://github.com/Sitecore/content-sdk/blob/6eb16655f677d9f2c9f82dbf67e6f8a92dd58ada/packages/utils/src/converters/flatten-object.ts#L14)

Flattens a nested object by concatenating keys with an underscore.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `FlattenObjectDataParameters` | Parameters describing the flatten operation. |

## Returns

[`FlattenedObject`](../interfaces/FlattenedObject.md)

A new flattened object.

## Example

```ts
const object = { order: { amount: 1, delivered: false } };
const flattenedObject = flattenObject(object);
// flattenedObject is { order_amount: 1, order_delivered: false }
```
