[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / decryptData

# Variable: decryptData()

> **decryptData**: (`payload`, `tenantId`, `cleanupOnFailure`) => `Promise`\<`null` \| `string`\> = `_decryptData`

Defined in: [packages/core/src/tools/auth/encryption.ts:24](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/encryption.ts#L24)

Decrypts encrypted payload using AES-256-GCM for a specific tenant.
If key is corrupted or invalid, optionally clears both key and tenant data.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `payload` | [`EncryptedPayload`](../../../type-aliases/EncryptedPayload.md) | `undefined` |  |
| `tenantId` | `string` | `undefined` |  |
| `cleanupOnFailure` | `boolean` | `true` |  |

## Returns

`Promise`\<`null` \| `string`\>
