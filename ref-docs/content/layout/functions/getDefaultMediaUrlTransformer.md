[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getDefaultMediaUrlTransformer

# Function: getDefaultMediaUrlTransformer()

> **getDefaultMediaUrlTransformer**(`edgeUrl`): (`value`) => `string`

Defined in: [content/src/layout/rewrite-edge-host.ts:129](https://github.com/Sitecore/content-sdk/blob/855bd4d7f25d36c9c4a22021da6d73fb13ad812f/packages/content/src/layout/rewrite-edge-host.ts#L129)

**`Internal`**

Returns the default media URL transformer: rewrites Experience Edge hostnames when custom hostname is configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edgeUrl` | `string` | Experience Edge URL to rewrite to (e.g. from resolveExperienceEdgeUrl()). |

## Returns

Transformer function; returns string unchanged when no custom hostname

(`value`) => `string`
