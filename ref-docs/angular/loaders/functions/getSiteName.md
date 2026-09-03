[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / getSiteName

# Function: getSiteName()

> **getSiteName**(`context`): `string`

Defined in: [packages/angular/src/loaders/context-helpers.ts:11](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/angular/src/loaders/context-helpers.ts#L11)

Read the site name resolved for the current request (multisite middleware →
`scParams`, with the configured default site applied by the server loader runner).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`LoaderContext`](../type-aliases/LoaderContext.md) | Loader context. |

## Returns

`string`

Site name for the current request.
