[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / flattenObject

# Function: flattenObject()

> **flattenObject**(`data`): [`FlattenedObject`](../interfaces/FlattenedObject.md)

Defined in: [analytics-core/src/utils/converters/flatten-object.ts:15](https://github.com/Sitecore/content-sdk/blob/77825b9deac7ebde4022f21ad02170354dd2da15/packages/analytics-core/src/utils/converters/flatten-object.ts#L15)

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
