[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / resolveConfiguredRevalidateSecret

# Function: resolveConfiguredRevalidateSecret()

> **resolveConfiguredRevalidateSecret**(`secretOption`, `envValue`): `string` \| `undefined`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L21)

**`Internal`**

Returns a non-empty trimmed secret, or `undefined` when unset or whitespace-only.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `secretOption` | `string` \| `undefined` | Explicit secret from handler options. |
| `envValue` | `string` \| `undefined` | Secret from `process.env` (e.g. `SITECORE_REVALIDATE_SECRET`). |

## Returns

`string` \| `undefined`

The resolved secret
