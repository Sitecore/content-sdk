[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / validateAuthInfo

# Function: validateAuthInfo()

> **validateAuthInfo**(`authInfo`): `boolean`

Defined in: [packages/core/src/tools/auth/renewal.ts:16](https://github.com/Sitecore/content-sdk/blob/458187ff9fb374e734a531d840a9956b30fbb79e/packages/core/src/tools/auth/renewal.ts#L16)

Validates whether a given auth config is still valid (i.e., not expired).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `authInfo` | [`TenantAuth`](../../../interfaces/TenantAuth.md) | The tenant auth configuration. |

## Returns

`boolean`

True if the token is still valid, false if expired.
