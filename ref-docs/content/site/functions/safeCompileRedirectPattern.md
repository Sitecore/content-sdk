[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / safeCompileRedirectPattern

# Function: safeCompileRedirectPattern()

> **safeCompileRedirectPattern**(`pattern`): `RegExp` \| `null`

Defined in: [content/src/site/redirect-utils.ts:169](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/site/redirect-utils.ts#L169)

**`Internal`**

Compiles a redirect pattern to RegExp; returns null if Sitecore produced a malformed rule
so one bad entry does not fail the entire redirect chain.
Supports both JS literal form (`/pattern/i`) and plain regex source (`^/path$`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern` | `string` | redirect pattern from redirect map |

## Returns

`RegExp` \| `null`

normalized regex instance, or null when invalid
