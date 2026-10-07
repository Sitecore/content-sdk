[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / getSiteName

# Function: getSiteName()

> **getSiteName**(`context`): `string`

Defined in: [packages/angular/src/loaders/context-helpers.ts:11](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/angular/src/loaders/context-helpers.ts#L11)

Read the site name resolved for the current request (multisite middleware →
`scParams`, with the configured default site applied by the server loader runner).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`LoaderContext`](../type-aliases/LoaderContext.md) | Loader context. |

## Returns

`string`

Site name for the current request.
