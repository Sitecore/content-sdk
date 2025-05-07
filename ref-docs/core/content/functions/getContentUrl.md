[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / getContentUrl

# Function: getContentUrl()

> **getContentUrl**(`params`): `string`

Defined in: [packages/core/src/content/utils.ts:12](https://github.com/Sitecore/content-sdk/blob/b60d4881ed47b9a004bc31855cb9a3fd1d4f6563/packages/core/src/content/utils.ts#L12)

Get the Content graphql endpoint url

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `environment`: `string`; `preview`: `boolean`; `tenant`: `string`; `url`: `string`; \} | Parameters |
| `params.environment` | `string` | Environment name |
| `params.preview` | `boolean` | Indicates if preview mode is enabled |
| `params.tenant` | `string` | Tenant name |
| `params.url`? | `string` | Content base graphql endpoint url |

## Returns

`string`

Content graphql endpoint url
