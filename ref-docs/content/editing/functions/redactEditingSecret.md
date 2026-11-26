[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / redactEditingSecret

# Function: redactEditingSecret()

> **redactEditingSecret**\<`T`\>(`query?`): `T` \| `undefined`

Defined in: [content/src/editing/utils.ts:35](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/content/src/editing/utils.ts#L35)

**`Internal`**

Returns a copy of editing request query parameters with the editing secret replaced by
[REDACTED\_VALUE](../variables/REDACTED_VALUE.md), so request details can be written to debug output without leaking it.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `object` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query?` | `T` | Editing request query parameters |

## Returns

`T` \| `undefined`

Query parameters with the editing secret redacted
