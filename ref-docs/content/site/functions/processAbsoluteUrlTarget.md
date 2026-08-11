[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / processAbsoluteUrlTarget

# Function: processAbsoluteUrlTarget()

> **processAbsoluteUrlTarget**(`incomingPathData`, `existsRedirect`): `string`

Defined in: [content/src/site/redirect-utils.ts:236](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/content/src/site/redirect-utils.ts#L236)

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
