[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [client](../README.md) / getEdgeProxyContentUrl

# Variable: getEdgeProxyContentUrl()

> `const` **getEdgeProxyContentUrl**: (`sitecoreEdgeContextId`, `sitecoreEdgeUrl?`) => `string`

Defined in: core/types/client/edge-proxy.d.ts:8

Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sitecoreEdgeContextId` | `string` | The unique context id. |
| `sitecoreEdgeUrl?` | `string` | The base endpoint URL for the Edge Platform. Default is https://edge-platform.sitecorecloud.io |

## Returns

`string`

The complete URL for accessing content through the Edge Platform.
