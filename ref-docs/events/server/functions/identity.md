[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [server](../README.md) / identity

# Function: identity()

> **identity**(`request`, `identityData`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/identity/identityServer.ts:18](https://github.com/Sitecore/content-sdk/blob/6eb16655f677d9f2c9f82dbf67e6f8a92dd58ada/packages/events/src/events/identity/identityServer.ts#L18)

A function that sends an IDENTITY event to SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | Interface with constraint for extending request |
| `identityData` | [`IdentityData`](../../browser/interfaces/IdentityData.md) | The required/optional attributes in order to be send to SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore EP returns
