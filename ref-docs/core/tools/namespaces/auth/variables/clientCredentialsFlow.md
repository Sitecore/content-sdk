[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / clientCredentialsFlow

# Variable: clientCredentialsFlow()

> **clientCredentialsFlow**: (`params`) => `Promise`\<\{ `accessToken`: `string`; `data`: [`AuthResponse`](../../../interfaces/AuthResponse.md); `tokenOrgId`: `any`; `tokenTenantId`: `any`; `tokenTenantName`: `any`; \}\> = `_clientCredentialsFlow`

Defined in: [packages/core/src/tools/auth/flow.ts:29](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/flow.ts#L29)

Performs the OAuth 2.0 client credentials flow to obtain a JWT access token
from the Sitecore Identity Provider using the provided client credentials.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`TenantArgs`](../../../interfaces/TenantArgs.md) | Parameters including clientId, clientSecret, organizationId, tenantId, audience, authority, and baseUrl. |

## Returns

`Promise`\<\{ `accessToken`: `string`; `data`: [`AuthResponse`](../../../interfaces/AuthResponse.md); `tokenOrgId`: `any`; `tokenTenantId`: `any`; `tokenTenantName`: `any`; \}\>

A Promise that resolves to the access token response (including access token, token type, expiry, etc.)

## Throws

Will log and exit the process if the request fails or returns a non-OK status
