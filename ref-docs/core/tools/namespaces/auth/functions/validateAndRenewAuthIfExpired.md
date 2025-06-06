[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / validateAndRenewAuthIfExpired

# Function: validateAndRenewAuthIfExpired()

> **validateAndRenewAuthIfExpired**(): `Promise`\<`null` \| \{ `tenantId`: `string`; \}\>

Defined in: [packages/core/src/tools/auth/renewal.ts:59](https://github.com/Sitecore/content-sdk/blob/c4877aff000b8d9a8895579af6291c408f942c16/packages/core/src/tools/auth/renewal.ts#L59)

Ensures a valid token exists, renews it if expired.
Returns tenant context if successful, otherwise null.

## Returns

`Promise`\<`null` \| \{ `tenantId`: `string`; \}\>
