[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [client](../README.md) / getEdgeProxyContentUrl

# Variable: getEdgeProxyContentUrl()

> `const` **getEdgeProxyContentUrl**: (`sitecoreEdgeUrl?`) => `string`

Defined in: content/types/client/edge-proxy.d.ts:7

Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sitecoreEdgeUrl?` | `string` | The base endpoint URL for the Edge Platform (resolved at config level). Defaults to platform URL. |

## Returns

`string`

The complete URL for accessing content through the Edge Platform.
