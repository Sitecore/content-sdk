[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / validateAuthInfo

# Function: validateAuthInfo()

> **validateAuthInfo**(`authInfo`): `boolean`

Defined in: [packages/core/src/tools/auth/renewal.ts:44](https://github.com/Sitecore/content-sdk/blob/dfabaa9ada9db515612e737f52c405833da25101/packages/core/src/tools/auth/renewal.ts#L44)

Validates whether a given auth config is still valid (i.e., not expired).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `authInfo` | [`TenantAuthInfo`](../../../interfaces/TenantAuthInfo.md) | The tenant auth configuration. |

## Returns

`boolean`

True if the token is still valid, false if expired.
