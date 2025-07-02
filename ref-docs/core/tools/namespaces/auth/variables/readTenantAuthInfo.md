[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / readTenantAuthInfo

# Variable: readTenantAuthInfo()

> **readTenantAuthInfo**: (`tenantId`) => `Promise`\<`null` \| [`TenantAuthInfo`](../../../interfaces/TenantAuthInfo.md)\> = `_readTenantAuthInfo`

Defined in: [packages/core/src/tools/auth/tenant-store.ts:30](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/tenant-store.ts#L30)

Read the authentication configuration for a tenant.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tenantId` | `string` | The tenant ID. |

## Returns

`Promise`\<`null` \| [`TenantAuthInfo`](../../../interfaces/TenantAuthInfo.md)\>

Parsed auth config or null if not found or failed to read.
