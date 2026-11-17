[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [internal](../README.md) / fetchProfileIdFromEdgeProxy

# Function: fetchProfileIdFromEdgeProxy()

> **fetchProfileIdFromEdgeProxy**(`clientId`, `contextId`, `edgeUrl`): `Promise`\<`string`\>

Defined in: [personalize/src/profile-id/fetch-profile-id-from-edge-proxy.ts:16](https://github.com/Sitecore/content-sdk/blob/83c3585a0a21e4640bc818f7e60ba915fa2bfbaf/packages/personalize/src/profile-id/fetch-profile-id-from-edge-proxy.ts#L16)

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
