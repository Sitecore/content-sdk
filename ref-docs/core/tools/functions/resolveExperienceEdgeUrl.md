[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / resolveExperienceEdgeUrl

# Function: resolveExperienceEdgeUrl()

> **resolveExperienceEdgeUrl**(): `string`

Defined in: [packages/core/src/tools/resolve-edge-url.ts:69](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/core/src/tools/resolve-edge-url.ts#L69)

Resolves the Experience Edge URL for media URL rewriting.
Use only when rewriting media URLs in layout/editing (e.g. rewriteEdgeHostInResponse).
Priority: SITECORE_EXPERIENCE_EDGE_HOSTNAME env, then default (edge.sitecorecloud.io).
Server-side only.

## Returns

`string`

The Experience Edge base URL (no trailing slash)
