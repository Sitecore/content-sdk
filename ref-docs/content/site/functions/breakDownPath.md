[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / breakDownPath

# Function: breakDownPath()

> **breakDownPath**(`configuredLocales`, `urlPath`): [`ProcessedPath`](../type-aliases/ProcessedPath.md)

Defined in: [content/src/site/redirect-utils.ts:41](https://github.com/Sitecore/content-sdk/blob/a8a17de670f6378fa21e08a9c76841c041afb7fd/packages/content/src/site/redirect-utils.ts#L41)

**`Internal`**

Splits a URL path into its (optional) leading locale segment, the remaining
locale-less path, and the query string. Locales are compared case-insensitively.
A leading slash is always ensured on `nonLocalePath`; any trailing slash is preserved
so slash-sensitive regex redirect rules can still be matched downstream.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `configuredLocales` | `string`[] | configured site locales |
| `urlPath` | `string` | path (optionally including a `?query`) |

## Returns

[`ProcessedPath`](../type-aliases/ProcessedPath.md)

broken-down path parts
