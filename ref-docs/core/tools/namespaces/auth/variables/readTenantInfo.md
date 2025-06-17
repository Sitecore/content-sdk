[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / readTenantInfo

# Variable: readTenantInfo()

> **readTenantInfo**: (`tenantId`) => `Promise`\<`null` \| [`TenantInfo`](../../../interfaces/TenantInfo.md)\> = `_readTenantInfo`

Defined in: [packages/core/src/tools/auth/tenant-store.ts:43](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/tenant-store.ts#L43)

Read the public metadata information for a tenant.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tenantId` | `string` | The tenant ID. |

## Returns

`Promise`\<`null` \| [`TenantInfo`](../../../interfaces/TenantInfo.md)\>

Parsed tenant info or null if not found or failed to read.
