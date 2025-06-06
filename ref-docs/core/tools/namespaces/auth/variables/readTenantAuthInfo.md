[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / readTenantAuthInfo

# Variable: readTenantAuthInfo()

> **readTenantAuthInfo**: (`tenantId`) => `Promise`\<`null` \| [`TenantAuth`](../../../interfaces/TenantAuth.md)\> = `_readTenantAuthInfo`

Defined in: [packages/core/src/tools/auth/tenant-store.ts:30](https://github.com/Sitecore/content-sdk/blob/c4877aff000b8d9a8895579af6291c408f942c16/packages/core/src/tools/auth/tenant-store.ts#L30)

Read the authentication configuration for a tenant.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tenantId` | `string` | The tenant ID. |

## Returns

`Promise`\<`null` \| [`TenantAuth`](../../../interfaces/TenantAuth.md)\>

Parsed auth config or null if not found or failed to read.
