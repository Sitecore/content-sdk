[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / resolveUrl

# Function: resolveUrl()

> **resolveUrl**(`urlBase`, `params`): `string`

Defined in: [packages/core/src/tools/utils.ts:36](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/tools/utils.ts#L36)

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
