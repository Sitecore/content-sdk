[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [server](../README.md) / identity

# Function: identity()

> **identity**(`request`, `identityData`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/identity/identityServer.ts:18](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/events/src/events/identity/identityServer.ts#L18)

A function that sends an IDENTITY event to SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | Interface with constraint for extending request |
| `identityData` | [`IdentityData`](../../browser/interfaces/IdentityData.md) | The required/optional attributes in order to be send to SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore EP returns
