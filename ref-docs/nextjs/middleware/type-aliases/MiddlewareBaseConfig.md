[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig** = `object`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:11](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L11)
=======
Defined in: [nextjs/src/middleware/middleware.ts:11](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L11)
>>>>>>> dd686bb50 (Update API docs)

## Properties

### defaultHostname?

> `optional` **defaultHostname**: `string`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L22)
=======
Defined in: [nextjs/src/middleware/middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L22)
>>>>>>> dd686bb50 (Update API docs)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L27)
=======
Defined in: [nextjs/src/middleware/middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L27)
>>>>>>> dd686bb50 (Update API docs)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L31)
=======
Defined in: [nextjs/src/middleware/middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L31)
>>>>>>> dd686bb50 (Update API docs)

Site resolution implementation by name/hostname

***

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L17)
=======
Defined in: [nextjs/src/middleware/middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L17)
>>>>>>> dd686bb50 (Update API docs)

function, determines if middleware execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from middleware handler |
| `res` | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`
