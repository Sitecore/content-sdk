[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / getSiteName

# Function: getSiteName()

> **getSiteName**(`context`): `string`

Defined in: [packages/angular/src/loaders/context-helpers.ts:11](https://github.com/Sitecore/content-sdk/blob/8b18c6e6c2cc3546028f5408655ca263435d7507/packages/angular/src/loaders/context-helpers.ts#L11)

Read the site name resolved for the current request (multisite middleware →
`scParams`, with the configured default site applied by the server loader runner).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`LoaderContext`](../type-aliases/LoaderContext.md) | Loader context. |

## Returns

`string`

Site name for the current request.
