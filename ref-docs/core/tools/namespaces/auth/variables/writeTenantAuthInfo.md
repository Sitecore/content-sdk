[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / writeTenantAuthInfo

# Variable: writeTenantAuthInfo()

> **writeTenantAuthInfo**: (`tenantId`, `authInfo`) => `Promise`\<`void`\> = `_writeTenantAuthInfo`

Defined in: [packages/core/src/tools/auth/tenant-store.ts:23](https://github.com/Sitecore/content-sdk/blob/458187ff9fb374e734a531d840a9956b30fbb79e/packages/core/src/tools/auth/tenant-store.ts#L23)

Write the authentication configuration for a tenant.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tenantId` | `string` | The tenant ID. |
| `authInfo` | [`TenantAuth`](../../../interfaces/TenantAuth.md) | The tenant's auth data. |

## Returns

`Promise`\<`void`\>
