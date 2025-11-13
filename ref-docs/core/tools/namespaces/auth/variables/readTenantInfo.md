[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / readTenantInfo

# Variable: readTenantInfo()

> **readTenantInfo**: (`tenantId`) => `Promise`\<`null` \| [`TenantInfo`](../../../interfaces/TenantInfo.md)\> = `_readTenantInfo`

Defined in: [packages/core/src/tools/auth/tenant-store.ts:43](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/tenant-store.ts#L43)

Read the public metadata information for a tenant.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tenantId` | `string` | The tenant ID. |

## Returns

`Promise`\<`null` \| [`TenantInfo`](../../../interfaces/TenantInfo.md)\>

Parsed tenant info or null if not found or failed to read.
