[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig**: `object`

Defined in: [nextjs/src/middleware/middleware.ts:7](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/nextjs/src/middleware/middleware.ts#L7)

## Type declaration

### defaultHostname?

> `optional` **defaultHostname**: `string`

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Site resolution implementation by name/hostname

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

function, determines if middleware execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from middleware handler |
| `res` | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`
