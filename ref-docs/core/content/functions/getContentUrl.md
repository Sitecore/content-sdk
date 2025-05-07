[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / getContentUrl

# Function: getContentUrl()

> **getContentUrl**(`params`): `string`

Defined in: [packages/core/src/content/utils.ts:12](https://github.com/Sitecore/xmc-jss-dev/blob/fb28e62d080186b27c7d4ce8540b36be242e1f86/packages/core/src/content/utils.ts#L12)

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
