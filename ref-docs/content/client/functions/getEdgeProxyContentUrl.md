[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / getEdgeProxyContentUrl

# Function: getEdgeProxyContentUrl()

> **getEdgeProxyContentUrl**(`sitecoreEdgeUrl?`): `string`

Defined in: [content/src/client/edge-proxy.ts:19](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/content/src/client/edge-proxy.ts#L19)

Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeUrl?` | `string` | `constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT` | The base endpoint URL for the Edge Platform (resolved at config level). Defaults to platform URL. |

## Returns

`string`

The complete URL for accessing content through the Edge Platform.
