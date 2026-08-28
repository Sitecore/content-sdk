[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / fetchClientIdFromEdgeProxy

# Function: fetchClientIdFromEdgeProxy()

> **fetchClientIdFromEdgeProxy**(`edgeUrl`, `contextId`, `timeout?`): `Promise`\<[`VisitorIds`](../interfaces/VisitorIds.md)\>

Defined in: [analytics-core/src/client-id/fetch-client-id-from-edge-proxy.ts:16](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/analytics-core/src/client-id/fetch-client-id-from-edge-proxy.ts#L16)

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
