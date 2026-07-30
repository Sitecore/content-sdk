[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / matchRedirectItemRedirect

# Function: matchRedirectItemRedirect()

> **matchRedirectItemRedirect**(`redirects`, `locale`, `nonLocalePath`): [`RedirectResult`](../type-aliases/RedirectResult.md) \| `undefined`

Defined in: [content/src/site/redirect-utils.ts:149](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/content/src/site/redirect-utils.ts#L149)

**`Internal`**

Processes redirect rules from redirect items (language-versioned)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redirects` | [`RedirectResult`](../type-aliases/RedirectResult.md)[] | redirect entries from Edge |
| `locale` | `string` | current request locale |
| `nonLocalePath` | `string` | current request path with locale prefix stripped |

## Returns

[`RedirectResult`](../type-aliases/RedirectResult.md) \| `undefined`

matched redirect item redirect result or undefined
