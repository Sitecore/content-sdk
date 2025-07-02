[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / DeviceAuthResponse

# Interface: DeviceAuthResponse

Defined in: [packages/core/src/tools/auth/models.ts:169](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/models.ts#L169)

Response structure returned after initiating the device authorization flow.

## Properties

### device\_code

> **device\_code**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:173](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/models.ts#L173)

Code the device will use to poll the token endpoint.

***

### expires\_in

> **expires\_in**: `number`

Defined in: [packages/core/src/tools/auth/models.ts:189](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/models.ts#L189)

Time (in seconds) until the device code expires.

***

### interval

> **interval**: `number`

Defined in: [packages/core/src/tools/auth/models.ts:193](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/models.ts#L193)

Recommended polling interval (in seconds) for token requests.

***

### user\_code

> **user\_code**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:177](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/models.ts#L177)

Code shown to the user for manual input during verification.

***

### verification\_uri

> **verification\_uri**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:181](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/models.ts#L181)

URI where the user should go to complete authentication.

***

### verification\_uri\_complete?

> `optional` **verification\_uri\_complete**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:185](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/models.ts#L185)

Optional URI that includes the user code, allowing for a streamlined login experience.
