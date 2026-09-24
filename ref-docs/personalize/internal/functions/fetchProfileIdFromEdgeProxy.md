[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [internal](../README.md) / fetchProfileIdFromEdgeProxy

# Function: fetchProfileIdFromEdgeProxy()

> **fetchProfileIdFromEdgeProxy**(`clientId`, `contextId`, `edgeUrl`): `Promise`\<`string`\>

Defined in: [personalize/src/profile-id/fetch-profile-id-from-edge-proxy.ts:16](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/personalize/src/profile-id/fetch-profile-id-from-edge-proxy.ts#L16)

**`Internal`**

Gets the profile id from Edge Proxy.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clientId` | `string` | The client ID of the client. |
| `contextId` | `string` | The Sitecore Edge context ID. |
| `edgeUrl` | `string` | The Sitecore Edge base URL. |

## Returns

`Promise`\<`string`\>

A promise that resolves with the profile id.

## Throws

Will throw an error if the client key or client ID is invalid.
