[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / matchFromRedirectMapRedirect

# Function: matchFromRedirectMapRedirect()

> **matchFromRedirectMapRedirect**(`redirects`, `requestLocale`, `incomingPathData`): [`RedirectResult`](../type-aliases/RedirectResult.md) \| `undefined`

Defined in: [content/src/site/redirect-utils.ts:94](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/content/src/site/redirect-utils.ts#L94)

**`Internal`**

Matches redirect-map rules (rules without a `locale` field) against the incoming request.
The incoming path is provided pre-split as [ProcessedPath](../type-aliases/ProcessedPath.md), so matching starts from the
guaranteed locale-less `nonLocalePath` and rebuilds the locale-prefixed variant from it. This
avoids the ambiguity of a raw pathname that may or may not already carry a locale segment.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redirects` | [`RedirectResult`](../type-aliases/RedirectResult.md)[] | All redirects from the service (locale-scoped entries are filtered out). |
| `requestLocale` | `string` | locale of the current request |
| `incomingPathData` | [`ProcessedPath`](../type-aliases/ProcessedPath.md) | broken-down incoming path (locale-less path and query) |

## Returns

[`RedirectResult`](../type-aliases/RedirectResult.md) \| `undefined`

First matching redirect or undefined.
