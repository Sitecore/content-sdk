[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / applyMediaUrlRewrite

# Function: applyMediaUrlRewrite()

> **applyMediaUrlRewrite**\<`T`\>(`value`, `transform`): `T`

Defined in: [content/src/layout/rewrite-edge-host.ts:141](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/content/src/layout/rewrite-edge-host.ts#L141)

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
