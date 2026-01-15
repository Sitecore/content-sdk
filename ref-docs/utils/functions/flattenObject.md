[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / flattenObject

# Function: flattenObject()

> **flattenObject**(`data`): [`FlattenedObject`](../interfaces/FlattenedObject.md)

Defined in: [converters/flatten-object.ts:14](https://github.com/Sitecore/content-sdk/blob/c71aa78ec59bb08efdf821d01673c8efe517b118/packages/utils/src/converters/flatten-object.ts#L14)

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
