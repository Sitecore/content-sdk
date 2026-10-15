[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getDefaultMediaUrlTransformer

# Function: getDefaultMediaUrlTransformer()

> **getDefaultMediaUrlTransformer**(`edgeUrl`): (`value`) => `string`

Defined in: [content/src/layout/rewrite-edge-host.ts:119](https://github.com/Sitecore/content-sdk/blob/5b6de22f85fe8291e5526ff894ecf1aa2f7ab37c/packages/content/src/layout/rewrite-edge-host.ts#L119)

**`Internal`**

Returns the default media URL transformer: rewrites Experience Edge hostnames when custom hostname is configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edgeUrl` | `string` | Experience Edge URL to rewrite to (e.g. from resolveExperienceEdgeUrl()). |

## Returns

Transformer function; returns string unchanged when no custom hostname

(`value`) => `string`
