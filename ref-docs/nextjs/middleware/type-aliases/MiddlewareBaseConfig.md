[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig** = `object`

Defined in: [nextjs/src/middleware/middleware.ts:12](https://github.com/Sitecore/content-sdk/blob/e9db4b450860d4e5f9f71fd28fd89a6300395c4d/packages/nextjs/src/middleware/middleware.ts#L12)

## Properties

### defaultHostname?

> `optional` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:23](https://github.com/Sitecore/content-sdk/blob/e9db4b450860d4e5f9f71fd28fd89a6300395c4d/packages/nextjs/src/middleware/middleware.ts#L23)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:28](https://github.com/Sitecore/content-sdk/blob/e9db4b450860d4e5f9f71fd28fd89a6300395c4d/packages/nextjs/src/middleware/middleware.ts#L28)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/middleware/middleware.ts:32](https://github.com/Sitecore/content-sdk/blob/e9db4b450860d4e5f9f71fd28fd89a6300395c4d/packages/nextjs/src/middleware/middleware.ts#L32)

Site resolution implementation by name/hostname

***

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/e9db4b450860d4e5f9f71fd28fd89a6300395c4d/packages/nextjs/src/middleware/middleware.ts#L18)

function, determines if middleware execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from middleware handler |
| `res` | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`
