[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [server](../README.md) / identity

# Function: identity()

> **identity**(`request`, `identityData`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/identity/identityServer.ts:18](https://github.com/Sitecore/content-sdk/blob/a268b42996e15dfe7c883c983d1b99c91b97a726/packages/events/src/events/identity/identityServer.ts#L18)

A function that sends an IDENTITY event to SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | Interface with constraint for extending request |
| `identityData` | [`IdentityData`](../../browser/interfaces/IdentityData.md) | The required/optional attributes in order to be send to SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore EP returns
