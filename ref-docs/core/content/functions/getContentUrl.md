[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / getContentUrl

# Function: getContentUrl()

> **getContentUrl**(`params`): `string`

Defined in: [packages/core/src/content/utils.ts:12](https://github.com/Sitecore/content-sdk/blob/458187ff9fb374e734a531d840a9956b30fbb79e/packages/core/src/content/utils.ts#L12)

Get the Content graphql endpoint url

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `environment`: `string`; `preview`: `boolean`; `tenant`: `string`; `url?`: `string`; \} | Parameters |
| `params.environment` | `string` | Environment name |
| `params.preview` | `boolean` | Indicates if preview mode is enabled |
| `params.tenant` | `string` | Tenant name |
| `params.url?` | `string` | Content base graphql endpoint url |

## Returns

`string`

Content graphql endpoint url
