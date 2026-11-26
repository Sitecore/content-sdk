[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / secretsEqual

# Function: secretsEqual()

> **secretsEqual**(`received`, `expected?`): `boolean`

Defined in: [packages/core/src/tools/secure-compare.ts:14](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/core/src/tools/secure-compare.ts#L14)

**`Internal`**

Compares two secrets in constant time to prevent timing attacks.
Both values are SHA-256 hashed first, so the compared buffers always have the same length
(`timingSafeEqual` throws on unequal lengths) and the secret length is not leaked.
Fails closed: returns false when either value is missing, empty or not a string
(e.g. a repeated query param parsed as an array).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `received` | `unknown` | The secret received with the request. |
| `expected?` | `string` \| `null` | The configured secret. |

## Returns

`boolean`

True when both secrets are non-empty and equal.
