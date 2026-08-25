[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / processRelativeUrlTarget

# Function: processRelativeUrlTarget()

> **processRelativeUrlTarget**(`incomingPathData`, `existsRedirect`, `configuredLocales`, `reqLocale`): `object`

Defined in: [content/src/site/redirect-utils.ts:261](https://github.com/Sitecore/content-sdk/blob/c9c8d1c0cd9bd014c418f5695be825137a97e6ba/packages/content/src/site/redirect-utils.ts#L261)

**`Internal`**

Resolves the locale-less path and target locale for a relative redirect URL.
The framework layer is responsible for placing the locale (pathname vs. locale property).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingPathData` | [`ProcessedPath`](../type-aliases/ProcessedPath.md) | broken-down incoming request path |
| `existsRedirect` | [`RedirectResult`](../type-aliases/RedirectResult.md) | matched redirect |
| `configuredLocales` | `string`[] | configured site locales |
| `reqLocale` | `string` | current request locale (used when `isLanguagePreserved`) |

## Returns

`object`

resolved locale and locale-less path (with query)

### targetLocale

> **targetLocale**: `string`

### targetPath

> **targetPath**: `string`
