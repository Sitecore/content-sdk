[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / validateAndRenewAuthIfExpired

# Function: validateAndRenewAuthIfExpired()

> **validateAndRenewAuthIfExpired**(): `Promise`\<`null` \| \{ `tenantId`: `string`; \}\>

Defined in: [packages/core/src/tools/auth/renewal.ts:87](https://github.com/Sitecore/content-sdk/blob/dfabaa9ada9db515612e737f52c405833da25101/packages/core/src/tools/auth/renewal.ts#L87)

Ensures a valid token exists, renews it if expired.

## Returns

`Promise`\<`null` \| \{ `tenantId`: `string`; \}\>

returns tenant context if successful, otherwise null.

## Throws

If renewal fails or credentials are missing.
