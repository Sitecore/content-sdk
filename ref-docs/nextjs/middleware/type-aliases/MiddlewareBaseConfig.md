[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig**: `object`

Defined in: [nextjs/src/middleware/middleware.ts:4](https://github.com/Sitecore/xmc-jss-dev/blob/ecfb4b66ff16c45f596cda74396c27d7d39de5a5/packages/nextjs/src/middleware/middleware.ts#L4)

## Type declaration

### defaultHostname?

> `optional` **defaultHostname**: `string`

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

### disabled()?

> `optional` **disabled**: (`req`?, `res`?) => `boolean`

function, determines if middleware should be turned off, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req`? | `NextRequest` | request object from middleware handler |
| `res`? | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`

### excludeRoute()?

> `optional` **excludeRoute**: (`pathname`) => `boolean`

Function used to determine if route should be excluded.
By default, files (pathname.includes('.')), Next.js API routes (pathname.startsWith('/api/')), and Sitecore API routes (pathname.startsWith('/sitecore/')) are ignored.
This is an important performance consideration since Next.js Edge middleware runs on every request.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pathname` | `string` | The pathname |

#### Returns

`boolean`

Whether to exclude the route

### siteResolver

> **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Site resolution implementation by name/hostname
