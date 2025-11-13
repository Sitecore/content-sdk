[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / TokenResponse

# Interface: TokenResponse

Defined in: [packages/core/src/tools/auth/models.ts:222](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L222)

Represents the raw OAuth token response returned by the authorization server.
This includes the access token, refresh token, and optional ID token and scope.

## Extended by

- [`RefreshAccessTokenResponse`](RefreshAccessTokenResponse.md)

## Properties

### access\_token

> **access\_token**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:224](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L224)

The access token used for authenticating API requests

***

### expires\_in

> **expires\_in**: `number`

Defined in: [packages/core/src/tools/auth/models.ts:228](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L228)

The number of seconds until the access token expires

***

### id\_token?

> `optional` **id\_token**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:232](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L232)

An optional ID token containing user identity claims (usually JWT)

***

### refresh\_token

> **refresh\_token**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:226](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L226)

The refresh token used to obtain a new access token when it expires

***

### scope?

> `optional` **scope**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:234](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L234)

The scopes granted for the access token, space-delimited

***

### token\_type

> **token\_type**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:230](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L230)

The type of token issued, typically "Bearer"
