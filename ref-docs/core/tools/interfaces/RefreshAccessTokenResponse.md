[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / RefreshAccessTokenResponse

# Interface: RefreshAccessTokenResponse

Defined in: [packages/core/src/tools/auth/models.ts:241](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L241)

Represents the application-specific token response returned by `_getRefreshAccessToken`.
In addition to the raw OAuth tokens, it includes the decoded `tenantName` for convenience.

## Extends

- [`TokenResponse`](TokenResponse.md)

## Properties

### access\_token

> **access\_token**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:224](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L224)

The access token used for authenticating API requests

#### Inherited from

[`TokenResponse`](TokenResponse.md).[`access_token`](TokenResponse.md#access_token)

***

### expires\_in

> **expires\_in**: `number`

Defined in: [packages/core/src/tools/auth/models.ts:228](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L228)

The number of seconds until the access token expires

#### Inherited from

[`TokenResponse`](TokenResponse.md).[`expires_in`](TokenResponse.md#expires_in)

***

### id\_token?

> `optional` **id\_token**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:232](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L232)

An optional ID token containing user identity claims (usually JWT)

#### Inherited from

[`TokenResponse`](TokenResponse.md).[`id_token`](TokenResponse.md#id_token)

***

### refresh\_token

> **refresh\_token**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:226](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L226)

The refresh token used to obtain a new access token when it expires

#### Inherited from

[`TokenResponse`](TokenResponse.md).[`refresh_token`](TokenResponse.md#refresh_token)

***

### scope?

> `optional` **scope**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:234](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L234)

The scopes granted for the access token, space-delimited

#### Inherited from

[`TokenResponse`](TokenResponse.md).[`scope`](TokenResponse.md#scope)

***

### tenantName?

> `optional` **tenantName**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:243](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L243)

The tenant name extracted from the decoded access token payload

***

### token\_type

> **token\_type**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:230](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L230)

The type of token issued, typically "Bearer"

#### Inherited from

[`TokenResponse`](TokenResponse.md).[`token_type`](TokenResponse.md#token_type)
