[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / safeCompileRedirectPattern

# Function: safeCompileRedirectPattern()

> **safeCompileRedirectPattern**(`pattern`): `RegExp` \| `null`

Defined in: [content/src/site/redirect-utils.ts:169](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/content/src/site/redirect-utils.ts#L169)

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
