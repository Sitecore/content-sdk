[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / getGuestIdServer

# Function: getGuestIdServer()

> **getGuestIdServer**(`browserId`): `Promise`\<`string`\>

Defined in: [src/guest-id/get-guest-id-server.ts:10](https://github.com/Sitecore/content-sdk/blob/6eb16655f677d9f2c9f82dbf67e6f8a92dd58ada/packages/__core__/src/guest-id/get-guest-id-server.ts#L10)

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
