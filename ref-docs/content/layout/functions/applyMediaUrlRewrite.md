[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / applyMediaUrlRewrite

# Function: applyMediaUrlRewrite()

> **applyMediaUrlRewrite**\<`T`\>(`value`, `transform`): `T`

Defined in: [content/src/layout/rewrite-edge-host.ts:144](https://github.com/Sitecore/content-sdk/blob/888eef99b46ec3cc8aafe70ca50b3ddbce1580b0/packages/content/src/layout/rewrite-edge-host.ts#L144)

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
