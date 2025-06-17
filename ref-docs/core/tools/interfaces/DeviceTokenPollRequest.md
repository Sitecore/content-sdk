[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / DeviceTokenPollRequest

# Interface: DeviceTokenPollRequest

Defined in: [packages/core/src/tools/auth/models.ts:199](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L199)

Input parameters for polling the OAuth 2.0 device token endpoint.

## Properties

### authority?

> `optional` **authority**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:215](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L215)

Optional OAuth 2.0 authority endpoint for token polling.

***

### clientId

> **clientId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:203](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L203)

OAuth 2.0 client identifier.

***

### device\_code

> **device\_code**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:207](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L207)

Device code previously obtained from the device authorization flow.

***

### interval?

> `optional` **interval**: `number`

Defined in: [packages/core/src/tools/auth/models.ts:211](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/models.ts#L211)

Optional polling interval in seconds. If not provided, a default is used.
