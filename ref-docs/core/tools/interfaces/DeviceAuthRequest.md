[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / DeviceAuthRequest

# Interface: DeviceAuthRequest

Defined in: [packages/core/src/tools/auth/models.ts:147](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L147)

Input parameters for initiating the OAuth 2.0 Device Authorization flow.

## Properties

### audience

> **audience**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:155](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L155)

The intended recipient of the token (usually your protected resource or API).

***

### authority

> **authority**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:159](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L159)

OAuth 2.0 authority URL (token issuer).

***

### baseUrl

> **baseUrl**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:163](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L163)

Base URL for your API, used to build custom claims or context if needed.

***

### clientId

> **clientId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:151](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L151)

OAuth 2.0 client identifier.
