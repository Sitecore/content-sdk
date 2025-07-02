[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / encryptData

# Variable: encryptData()

> **encryptData**: (`plaintext`, `tenantId`) => `Promise`\<[`EncryptedPayload`](../../../type-aliases/EncryptedPayload.md)\> = `_encryptData`

Defined in: [packages/core/src/tools/auth/encryption.ts:16](https://github.com/Sitecore/content-sdk/blob/9a33e9e1db9023edc68e7b947d4b59cefcd02c89/packages/core/src/tools/auth/encryption.ts#L16)

Encrypts plaintext using AES-256-GCM for a given tenant.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | `string` |  |
| `tenantId` | `string` |  |

## Returns

`Promise`\<[`EncryptedPayload`](../../../type-aliases/EncryptedPayload.md)\>
