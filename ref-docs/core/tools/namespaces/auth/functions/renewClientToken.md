[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / renewClientToken

# Function: renewClientToken()

> **renewClientToken**(`authInfo`, `tenantInfo`): `Promise`\<`void`\>

Defined in: [packages/core/src/tools/auth/renewal.ts:29](https://github.com/Sitecore/content-sdk/blob/458187ff9fb374e734a531d840a9956b30fbb79e/packages/core/src/tools/auth/renewal.ts#L29)

Renews the token for a given tenant using stored credentials.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `authInfo` | [`TenantAuth`](../../../interfaces/TenantAuth.md) | Current authentication info for the tenant. |
| `tenantInfo` | [`TenantInfo`](../../../interfaces/TenantInfo.md) | Public metadata about the tenant (e.g., clientId). |

## Returns

`Promise`\<`void`\>

Promise<void>

## Throws

If credentials are missing or renewal fails.
