[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / getGuestIdServer

# Function: getGuestIdServer()

> **getGuestIdServer**(`browserId`): `Promise`\<`string`\>

Defined in: [src/guest-id/get-guest-id-server.ts:10](https://github.com/Sitecore/content-sdk/blob/dc098bf2453ff3d6378a7cb98a7f84ad282af7af/packages/analytics-core/src/guest-id/get-guest-id-server.ts#L10)

Returns the guest ID for the given browser ID.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `browserId` | `string` | The browser ID of the client. |

## Returns

`Promise`\<`string`\>

A promise that resolves with the guest ID.

## Throws

Will throw an error if the Sitecore Edge context ID is incorrect.
