[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / renewClientToken

# Function: renewClientToken()

> **renewClientToken**(`authInfo`, `tenantInfo`): `Promise`\<`void`\>

Defined in: [packages/core/src/tools/auth/renewal.ts:57](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/renewal.ts#L57)

Renews the token for a given tenant using stored credentials.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `authInfo` | [`TenantAuthInfo`](../../../interfaces/TenantAuthInfo.md) | Current authentication info for the tenant. |
| `tenantInfo` | [`TenantInfo`](../../../interfaces/TenantInfo.md) | Public metadata about the tenant (e.g., clientId). |

## Returns

`Promise`\<`void`\>

resolving when the token is successfully renewed.

## Throws

If credentials are missing or renewal fails.
