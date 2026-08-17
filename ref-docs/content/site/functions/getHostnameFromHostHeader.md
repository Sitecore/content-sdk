[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / getHostnameFromHostHeader

# Function: getHostnameFromHostHeader()

> **getHostnameFromHostHeader**(`host`): `string`

Defined in: [content/src/site/utils.ts:31](https://github.com/Sitecore/content-sdk/blob/84866ded66f6f8f69e7f007b2311494e086b493b/packages/content/src/site/utils.ts#L31)

**`Internal`**

Hostname from a `Host` or `x-forwarded-host` value, without port.
- `[::1]:3000` → `::1`
- `127.0.0.1:3000` → `127.0.0.1`
- `example.com:443` → `example.com`
- `::1` → `::1` (does not treat `:1` as a port)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `host` | `string` | Raw header value |

## Returns

`string`

The hostname
