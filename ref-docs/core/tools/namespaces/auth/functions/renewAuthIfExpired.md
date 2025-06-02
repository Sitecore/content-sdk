[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / renewAuthIfExpired

# Function: renewAuthIfExpired()

> **renewAuthIfExpired**(): `Promise`\<`null` \| \{ `tenantId`: `string`; \}\>

Defined in: [packages/core/src/tools/auth/renewal.ts:58](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/renewal.ts#L58)

Ensures a valid token exists, renews it if expired.
Returns tenant context if successful, otherwise null.

## Returns

`Promise`\<`null` \| \{ `tenantId`: `string`; \}\>
