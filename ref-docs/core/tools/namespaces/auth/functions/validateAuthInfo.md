[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / validateAuthInfo

# Function: validateAuthInfo()

> **validateAuthInfo**(`authInfo`): `boolean`

Defined in: [packages/core/src/tools/auth/renewal.ts:17](https://github.com/Sitecore/content-sdk/blob/c4877aff000b8d9a8895579af6291c408f942c16/packages/core/src/tools/auth/renewal.ts#L17)

Validates whether a given auth config is still valid (i.e., not expired).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `authInfo` | [`TenantAuth`](../../../interfaces/TenantAuth.md) | The tenant auth configuration. |

## Returns

`boolean`

True if the token is still valid, false if expired.
