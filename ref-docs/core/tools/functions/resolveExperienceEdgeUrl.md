[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / resolveExperienceEdgeUrl

# Function: resolveExperienceEdgeUrl()

> **resolveExperienceEdgeUrl**(): `string`

Defined in: [packages/core/src/tools/resolve-edge-url.ts:67](https://github.com/Sitecore/content-sdk/blob/13f1347930830c53c628f3a82680e058ba95d5e0/packages/core/src/tools/resolve-edge-url.ts#L67)

Resolves the Experience Edge URL for media URL rewriting.
Use only when rewriting media URLs in layout/editing (e.g. rewriteEdgeHostInResponse).
Priority: SITECORE_EXPERIENCE_EDGE_HOSTNAME env, then default (edge.sitecorecloud.io).
Server-side only.

## Returns

`string`

The Experience Edge base URL (no trailing slash)
