[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig** = `object`

Defined in: [nextjs/src/middleware/middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L17)

The interface for the Middleware configuration.

## Properties

### defaultHostname?

> `optional` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:28](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L28)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L33)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/middleware/middleware.ts:37](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L37)

Site resolution implementation by name/hostname

***

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:23](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L23)

function, determines if middleware execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from middleware handler |
| `res` | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`
