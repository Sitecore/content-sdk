[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / resolveConfiguredRevalidateSecret

# Function: resolveConfiguredRevalidateSecret()

> **resolveConfiguredRevalidateSecret**(`secretOption`, `envValue`): `string` \| `undefined`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L22)

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
