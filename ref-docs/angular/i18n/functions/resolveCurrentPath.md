[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [i18n](../README.md) / resolveCurrentPath

# Function: resolveCurrentPath()

> **resolveCurrentPath**(`req`, `isBrowser`): `string`

Defined in: [packages/angular/src/i18n/locale-utils.ts:70](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/i18n/locale-utils.ts#L70)

Resolves the initial URL pathname from the current execution environment.
Returns `'/'` when neither REQUEST nor `window.location` is available.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `Request` \| `null` | SSR REQUEST token value, when present. |
| `isBrowser` | `boolean` | Whether the current platform is the browser. |

## Returns

`string`

URL pathname suitable for locale extraction.
