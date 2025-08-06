[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / resolveUrl

# Function: resolveUrl()

> **resolveUrl**(`urlBase`, `params`): `string`

<<<<<<< HEAD
Defined in: [packages/core/src/utils/utils.ts:34](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/utils/utils.ts#L34)
=======
Defined in: [packages/core/src/utils/utils.ts:34](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/utils/utils.ts#L34)
>>>>>>> dd686bb50 (Update API docs)

Resolves a base URL that may contain query string parameters and an additional set of query
string parameters into a unified string representation.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `urlBase` | `string` | the base URL that may contain query string parameters |
| `params` | `ParsedUrlQueryInput` | query string parameters |

## Returns

`string`

a URL string

## Throws

if the provided url is an empty string
