[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / resolveEdgeUrlForStaticFiles

# Function: resolveEdgeUrlForStaticFiles()

> **resolveEdgeUrlForStaticFiles**(): `string`

Defined in: [packages/core/src/tools/resolve-edge-url.ts:91](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/core/src/tools/resolve-edge-url.ts#L91)

Resolves the Edge URL for static files (e.g. stylesheets) by ignoring the custom hostname.
Use this when the custom host does not serve static file paths (e.g. /v1/files/...).
Returns the default Edge Platform URL.

## Returns

`string`

The Edge Platform base URL for static files (no trailing slash)
