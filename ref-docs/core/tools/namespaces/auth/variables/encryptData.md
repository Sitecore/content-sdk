[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / encryptData

# Variable: encryptData()

> **encryptData**: (`plaintext`, `tenantId`) => `Promise`\<[`EncryptedPayload`](../../../type-aliases/EncryptedPayload.md)\> = `_encryptData`

Defined in: [packages/core/src/tools/auth/encryption.ts:16](https://github.com/Sitecore/content-sdk/blob/c4877aff000b8d9a8895579af6291c408f942c16/packages/core/src/tools/auth/encryption.ts#L16)

Encrypts plaintext using AES-256-GCM for a given tenant.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | `string` |  |
| `tenantId` | `string` |  |

## Returns

`Promise`\<[`EncryptedPayload`](../../../type-aliases/EncryptedPayload.md)\>
