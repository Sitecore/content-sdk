[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getDefaultMediaUrlTransformer

# Function: getDefaultMediaUrlTransformer()

> **getDefaultMediaUrlTransformer**(`edgeUrl`): (`value`) => `string`

Defined in: [content/src/layout/rewrite-edge-host.ts:116](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/content/src/layout/rewrite-edge-host.ts#L116)

**`Internal`**

Returns the default media URL transformer: rewrites Experience Edge hostnames when custom hostname is configured.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edgeUrl` | `string` | Experience Edge URL to rewrite to (e.g. from resolveExperienceEdgeUrl()). |

## Returns

Transformer function; returns string unchanged when no custom hostname

(`value`) => `string`
