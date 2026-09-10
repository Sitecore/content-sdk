[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / resolveEdgeUrlForStaticFiles

# Function: resolveEdgeUrlForStaticFiles()

> **resolveEdgeUrlForStaticFiles**(`edgeUrl?`): `string`

Defined in: [packages/core/src/tools/resolve-edge-url.ts:91](https://github.com/Sitecore/content-sdk/blob/2f14286ddbb524cc49993783ef29cc66d697e78d/packages/core/src/tools/resolve-edge-url.ts#L91)

Resolves the Edge URL for static files (e.g. stylesheets).
Uses the same explicit URL, environment hostname, and default fallback as other Edge requests.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edgeUrl?` | `string` | Optional explicit Edge URL to use |

## Returns

`string`

The resolved Edge Platform base URL for static files (no trailing slash)
