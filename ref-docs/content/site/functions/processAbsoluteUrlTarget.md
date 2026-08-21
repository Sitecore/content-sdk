[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / processAbsoluteUrlTarget

# Function: processAbsoluteUrlTarget()

> **processAbsoluteUrlTarget**(`incomingPathData`, `existsRedirect`): `string`

Defined in: [content/src/site/redirect-utils.ts:236](https://github.com/Sitecore/content-sdk/blob/2dc64e62333bc02156fe37ffdcae6ab8a71ff4cc/packages/content/src/site/redirect-utils.ts#L236)

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
