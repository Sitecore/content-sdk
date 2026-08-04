[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / resolveConfiguredRevalidateSecret

# Function: resolveConfiguredRevalidateSecret()

> **resolveConfiguredRevalidateSecret**(`secretOption`, `envValue`): `string` \| `undefined`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L22)

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
