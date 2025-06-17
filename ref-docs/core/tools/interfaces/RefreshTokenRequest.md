[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / RefreshTokenRequest

# Interface: RefreshTokenRequest

Defined in: [packages/core/src/tools/auth/models.ts:120](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L120)

Input parameters for exchanging a refresh token for a new access token.

## Properties

### authority?

> `optional` **authority**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:141](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L141)

Optional OAuth 2.0 authority endpoint (token issuer URL).
Defaults to the Sitecore standard authority if not provided.

***

### clientId

> **clientId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:124](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L124)

OAuth 2.0 client identifier.

***

### organizationId

> **organizationId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:136](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L136)

Organization identifier for multi-tenant authorization scope.

***

### refreshToken

> **refreshToken**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:128](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L128)

Refresh token previously issued by the authorization server.

***

### tenantId

> **tenantId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:132](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L132)

Tenant identifier to bind the request to a specific tenant context.
