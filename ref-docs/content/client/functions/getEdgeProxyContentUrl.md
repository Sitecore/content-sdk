[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / getEdgeProxyContentUrl

# Function: getEdgeProxyContentUrl()

> **getEdgeProxyContentUrl**(`sitecoreEdgeUrl?`): `string`

Defined in: [content/src/client/edge-proxy.ts:19](https://github.com/Sitecore/content-sdk/blob/11719c29a76964a5138c9b66c4ad7c2c94a0da6d/packages/content/src/client/edge-proxy.ts#L19)

Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeUrl?` | `string` | `constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT` | The base endpoint URL for the Edge Platform (resolved at config level). Defaults to platform URL. |

## Returns

`string`

The complete URL for accessing content through the Edge Platform.
