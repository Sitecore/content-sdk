[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / fetchBrowserIdFromEdgeProxy

# Function: fetchBrowserIdFromEdgeProxy()

> **fetchBrowserIdFromEdgeProxy**(`sitecoreEdgeUrl`, `sitecoreEdgeContextId`, `timeout?`): `Promise`\<`ProxySettings`\>

Defined in: [src/browser-id/fetch-browser-id-from-edge-proxy.ts:13](https://github.com/Sitecore/content-sdk/blob/4c91e9096c4e7c0afcb0aa1545c8537310c5d3aa/packages/analytics-core/src/browser-id/fetch-browser-id-from-edge-proxy.ts#L13)

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
