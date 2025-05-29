[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig** = `object`

Defined in: [nextjs/src/middleware/middleware.ts:11](https://github.com/Sitecore/content-sdk/blob/bb6cb0807445ce6665598cd43c4dc973fbd7c0ab/packages/nextjs/src/middleware/middleware.ts#L11)

## Properties

### defaultHostname?

> `optional` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/bb6cb0807445ce6665598cd43c4dc973fbd7c0ab/packages/nextjs/src/middleware/middleware.ts#L22)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/bb6cb0807445ce6665598cd43c4dc973fbd7c0ab/packages/nextjs/src/middleware/middleware.ts#L27)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/middleware/middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/bb6cb0807445ce6665598cd43c4dc973fbd7c0ab/packages/nextjs/src/middleware/middleware.ts#L31)

Site resolution implementation by name/hostname

***

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/bb6cb0807445ce6665598cd43c4dc973fbd7c0ab/packages/nextjs/src/middleware/middleware.ts#L17)

function, determines if middleware execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from middleware handler |
| `res` | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`
