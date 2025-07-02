[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / getRefreshAccessToken

# Variable: getRefreshAccessToken()

> **getRefreshAccessToken**: (`options`) => `Promise`\<[`RefreshAccessTokenResponse`](../../../interfaces/RefreshAccessTokenResponse.md)\> = `_getRefreshAccessToken`

Defined in: [packages/core/src/tools/auth/renewal.ts:28](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/renewal.ts#L28)

Requests a new access token using the OAuth 2.0 refresh token grant type.
This is used to "upgrade" an initial device flow token by including tenant-specific context.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RefreshTokenRequest`](../../../interfaces/RefreshTokenRequest.md) | Configuration for the refresh token request. |

## Returns

`Promise`\<[`RefreshAccessTokenResponse`](../../../interfaces/RefreshAccessTokenResponse.md)\>

A promise that resolves to the refreshed token data including tenant context.

## Throws

If the token request fails or returns an error response.
