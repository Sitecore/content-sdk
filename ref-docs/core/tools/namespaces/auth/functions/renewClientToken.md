[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / renewClientToken

# Function: renewClientToken()

> **renewClientToken**(`authInfo`, `tenantInfo`): `Promise`\<`void`\>

Defined in: [packages/core/src/tools/auth/renewal.ts:30](https://github.com/Sitecore/content-sdk/blob/c4877aff000b8d9a8895579af6291c408f942c16/packages/core/src/tools/auth/renewal.ts#L30)

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
