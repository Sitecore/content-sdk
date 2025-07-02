[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / validateAuthInfo

# Function: validateAuthInfo()

> **validateAuthInfo**(`authInfo`): `boolean`

Defined in: [packages/core/src/tools/auth/renewal.ts:44](https://github.com/Sitecore/content-sdk/blob/7ebeab3cd807229f59268e182358c9f141c84ddc/packages/core/src/tools/auth/renewal.ts#L44)

Validates whether a given auth config is still valid (i.e., not expired).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `authInfo` | [`TenantAuthInfo`](../../../interfaces/TenantAuthInfo.md) | The tenant auth configuration. |

## Returns

`boolean`

True if the token is still valid, false if expired.
