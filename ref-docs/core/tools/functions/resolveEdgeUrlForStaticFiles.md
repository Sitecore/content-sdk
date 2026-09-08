[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / resolveEdgeUrlForStaticFiles

# Function: resolveEdgeUrlForStaticFiles()

> **resolveEdgeUrlForStaticFiles**(`edgeUrl?`): `string`

Defined in: [packages/core/src/tools/resolve-edge-url.ts:91](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/core/src/tools/resolve-edge-url.ts#L91)

Resolves the Edge URL for static files (e.g. stylesheets).
Uses the same explicit URL, environment hostname, and default fallback as other Edge requests.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edgeUrl?` | `string` | Optional explicit Edge URL to use |

## Returns

`string`

The resolved Edge Platform base URL for static files (no trailing slash)
