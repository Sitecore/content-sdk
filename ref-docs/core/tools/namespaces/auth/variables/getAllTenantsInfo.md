[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / getAllTenantsInfo

# Variable: getAllTenantsInfo()

> **getAllTenantsInfo**: () => [`TenantInfo`](../../../interfaces/TenantInfo.md)[] = `_getAllTenantsInfo`

Defined in: [packages/core/src/tools/auth/tenant-store.ts:55](https://github.com/Sitecore/content-sdk/blob/458187ff9fb374e734a531d840a9956b30fbb79e/packages/core/src/tools/auth/tenant-store.ts#L55)

Scans the CLI root directory and returns all valid tenant infos.

## Returns

[`TenantInfo`](../../../interfaces/TenantInfo.md)[]

A list of TenantInfo objects found in {tenant-id}/info.json files.
