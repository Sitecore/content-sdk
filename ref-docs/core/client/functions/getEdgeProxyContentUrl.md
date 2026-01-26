[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / getEdgeProxyContentUrl

# Function: getEdgeProxyContentUrl()

> **getEdgeProxyContentUrl**(`sitecoreEdgeUrl?`): `string`

Defined in: [packages/core/src/client/edge-proxy.ts:9](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/core/src/client/edge-proxy.ts#L9)

Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeUrl?` | `string` | `SITECORE_EDGE_URL_DEFAULT` | The base endpoint URL for the Edge Platform. Default is https://edge-platform.sitecorecloud.io |

## Returns

`string`

The complete URL for accessing content through the Edge Platform.
