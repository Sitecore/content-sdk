[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / identity

# Function: identity()

> **identity**(`identityData`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/identity/identity.ts:15](https://github.com/Sitecore/content-sdk/blob/a8a17de670f6378fa21e08a9c76841c041afb7fd/packages/events/src/events/identity/identity.ts#L15)

A function that sends an IDENTITY event to the SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `identityData` | [`IdentityData`](../interfaces/IdentityData.md) | The required/optional attributes to be sent to the SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore Edge Proxy returns
