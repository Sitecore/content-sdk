[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / clientCredentialsFlow

# Variable: clientCredentialsFlow()

> **clientCredentialsFlow**: (`args`) => `Promise`\<\{ `accessToken`: `any`; `data`: `any`; `tokenOrgId`: `any`; `tokenTenantId`: `any`; `tokenTenantName`: `any`; \}\> = `_clientCredentialsFlow`

Defined in: [packages/core/src/tools/auth/flow.ts:26](https://github.com/Sitecore/content-sdk/blob/bfc146c0329a0b7cfd784733295357a039fb7d69/packages/core/src/tools/auth/flow.ts#L26)

Performs the OAuth 2.0 client credentials flow to obtain a JWT access token
from the Sitecore Identity Provider using the provided client credentials.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`TenantArgs`](../../../interfaces/TenantArgs.md) | The arguments for client credentials flow |

## Returns

`Promise`\<\{ `accessToken`: `any`; `data`: `any`; `tokenOrgId`: `any`; `tokenTenantId`: `any`; `tokenTenantName`: `any`; \}\>

A Promise that resolves to the access token response (including access token, token type, expiry, etc.)

## Throws

Will log and exit the process if the request fails or returns a non-OK status
