[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / resolveUrl

# Function: resolveUrl()

> **resolveUrl**(`urlBase`, `params`): `string`

Defined in: [packages/core/src/utils/utils.ts:34](https://github.com/Sitecore/content-sdk/blob/ccaca47e1d3be54d4807fac59220b223d5ccd97e/packages/core/src/utils/utils.ts#L34)

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
