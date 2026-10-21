[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / processAbsoluteUrlTarget

# Function: processAbsoluteUrlTarget()

> **processAbsoluteUrlTarget**(`incomingPathData`, `existsRedirect`): `string`

Defined in: [content/src/site/redirect-utils.ts:236](https://github.com/Sitecore/content-sdk/blob/ee7d15fb7ff51ecf52f6c48a5dd927ab6855f385/packages/content/src/site/redirect-utils.ts#L236)

**`Internal`**

Resolves the absolute redirect target (external redirects), optionally preseriving query string

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingPathData` | [`ProcessedPath`](../type-aliases/ProcessedPath.md) | non locale path, locale prefix and query string (if present) |
| `existsRedirect` | [`RedirectResult`](../type-aliases/RedirectResult.md) | matched redirect to resolve final result from |

## Returns

`string`

URL to redirect to
