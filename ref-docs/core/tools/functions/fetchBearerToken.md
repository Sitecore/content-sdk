[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / fetchBearerToken

# Function: fetchBearerToken()

> **fetchBearerToken**(`options`): `Promise`\<`any`\>

Defined in: [packages/core/src/tools/auth/fetch-bearer-token.ts:17](https://github.com/Sitecore/content-sdk/blob/6b15aee2c3c6f42f298231134179bbd643792be1/packages/core/src/tools/auth/fetch-bearer-token.ts#L17)

Connects to M2M endpoint and fetches the bearer token
Uses client_id and client_secret from environment variables

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `FetchBearerTokenOptions` | client id, secret, and other parameters for connection to m2m endpoint |

## Returns

`Promise`\<`any`\>

bearer token string
