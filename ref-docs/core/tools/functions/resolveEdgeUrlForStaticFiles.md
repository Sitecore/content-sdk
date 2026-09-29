[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / resolveEdgeUrlForStaticFiles

# Function: resolveEdgeUrlForStaticFiles()

> **resolveEdgeUrlForStaticFiles**(): `string`

Defined in: [packages/core/src/tools/resolve-edge-url.ts:84](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/core/src/tools/resolve-edge-url.ts#L84)

Resolves the Edge URL for static files (e.g. stylesheets) by ignoring the custom hostname.
Use this when the custom host does not serve static file paths (e.g. /v1/files/...).
Returns the default Edge Platform URL.

## Returns

`string`

The Edge Platform base URL for static files (no trailing slash)
