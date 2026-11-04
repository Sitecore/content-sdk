[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / applyMediaUrlRewrite

# Function: applyMediaUrlRewrite()

> **applyMediaUrlRewrite**\<`T`\>(`value`, `transform`): `T`

Defined in: [content/src/layout/rewrite-edge-host.ts:131](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/content/src/layout/rewrite-edge-host.ts#L131)

**`Internal`**

Deeply traverses a value and applies a string transformer to every string.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `T` | Value to process (layout, object, array, string) |
| `transform` | (`s`) => `string` | Function that transforms each string |

## Returns

`T`

New value with transformed strings
