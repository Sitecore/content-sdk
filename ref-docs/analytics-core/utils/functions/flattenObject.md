[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / flattenObject

# Function: flattenObject()

> **flattenObject**(`data`): [`FlattenedObject`](../interfaces/FlattenedObject.md)

Defined in: [analytics-core/src/utils/converters/flatten-object.ts:15](https://github.com/Sitecore/content-sdk/blob/553b16a67e807643f564a3c5208631654e0b2cef/packages/analytics-core/src/utils/converters/flatten-object.ts#L15)

**`Internal`**

Flattens a nested object by concatenating keys with an underscore.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | [`FlattenObjectDataParameters`](../interfaces/FlattenObjectDataParameters.md) | Parameters describing the flatten operation. |

## Returns

[`FlattenedObject`](../interfaces/FlattenedObject.md)

A new flattened object.

## Example

```ts
const object = { order: { amount: 1, delivered: false } };
const flattenedObject = flattenObject(object);
// flattenedObject is { order_amount: 1, order_delivered: false }
```
