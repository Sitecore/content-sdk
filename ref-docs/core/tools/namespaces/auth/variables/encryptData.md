[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / encryptData

# Variable: encryptData()

> **encryptData**: (`plaintext`, `tenantId`) => `Promise`\<[`EncryptedPayload`](../../../type-aliases/EncryptedPayload.md)\> = `_encryptData`

Defined in: [packages/core/src/tools/auth/encryption.ts:16](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/tools/auth/encryption.ts#L16)

Encrypts plaintext using AES-256-GCM for a given tenant.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | `string` |  |
| `tenantId` | `string` |  |

## Returns

`Promise`\<[`EncryptedPayload`](../../../type-aliases/EncryptedPayload.md)\>
