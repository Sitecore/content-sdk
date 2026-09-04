[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / getLanguage

# Function: getLanguage()

> **getLanguage**(`context`): `string` \| `undefined`

Defined in: [packages/angular/src/loaders/context-helpers.ts:47](https://github.com/Sitecore/content-sdk/blob/16e405f3667f5f05e5fd97b8174bd2b99de45db6/packages/angular/src/loaders/context-helpers.ts#L47)

Read the language for the current request from the matched route params
(`scLocaleMatcher` exposes the locale URL segment as `routeParams.locale`).
Returns `undefined` when no locale was matched — fall back to your
configured default language.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`LoaderContext`](../type-aliases/LoaderContext.md) | Loader context. |

## Returns

`string` \| `undefined`

Language for the current request.
