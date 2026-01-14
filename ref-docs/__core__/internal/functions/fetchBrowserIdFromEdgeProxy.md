[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / fetchBrowserIdFromEdgeProxy

# Function: fetchBrowserIdFromEdgeProxy()

> **fetchBrowserIdFromEdgeProxy**(`sitecoreEdgeUrl`, `sitecoreEdgeContextId`, `timeout?`): `Promise`\<`ProxySettings`\>

Defined in: [src/browser-id/fetch-browser-id-from-edge-proxy.ts:13](https://github.com/Sitecore/content-sdk/blob/6b7c7b667b2f4d24b0f2f2dc3cbdfa4d1a32ad10/packages/__core__/src/browser-id/fetch-browser-id-from-edge-proxy.ts#L13)

Gets the browser ID and client key from Sitecore Edge proxy.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sitecoreEdgeUrl` | `string` | The base URL for the Edge proxy API. |
| `sitecoreEdgeContextId` | `string` | The Sitecore context ID parameter for the Edge proxy API. |
| `timeout?` | `number` | The timeout in milliseconds for the call to the proxy. |

## Returns

`Promise`\<`ProxySettings`\>

The browser ID and guest ID from the proxy.
