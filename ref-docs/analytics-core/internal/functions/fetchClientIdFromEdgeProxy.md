[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / fetchClientIdFromEdgeProxy

# Function: fetchClientIdFromEdgeProxy()

> **fetchClientIdFromEdgeProxy**(`edgeUrl`, `contextId`, `timeout?`): `Promise`\<[`VisitorIds`](../interfaces/VisitorIds.md)\>

Defined in: [analytics-core/src/client-id/fetch-client-id-from-edge-proxy.ts:16](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/analytics-core/src/client-id/fetch-client-id-from-edge-proxy.ts#L16)

**`Internal`**

Gets the client ID and client key from Sitecore Edge proxy.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edgeUrl` | `string` | The base URL for the Edge proxy API. |
| `contextId` | `string` | The Sitecore context ID parameter for the Edge proxy API. |
| `timeout?` | `number` | The timeout in milliseconds for the call to the proxy. |

## Returns

`Promise`\<[`VisitorIds`](../interfaces/VisitorIds.md)\>

The client ID and profile ID from the proxy.
