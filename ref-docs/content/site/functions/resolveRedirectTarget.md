[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / resolveRedirectTarget

# Function: resolveRedirectTarget()

> **resolveRedirectTarget**(`existsRedirect`, `siteLanguage`, `requestPath`): `string`

Defined in: [content/src/site/redirect-utils.ts:205](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/content/src/site/redirect-utils.ts#L205)

**`Internal`**

Resolves the redirect target string: replaces the `$siteLang` token and applies
regex capture-group substitutions (`$1`, `$2`, …) when the rule pattern is a regex.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `existsRedirect` | [`RedirectResult`](../type-aliases/RedirectResult.md) | matched redirect |
| `siteLanguage` | `string` | site language used for the `$siteLang` token |
| `requestPath` | `string` | incoming request path, used when the rule stored no matched path |

## Returns

`string`

resolved target
