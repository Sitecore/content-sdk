[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig**: `object`

Defined in: [nextjs/src/middleware/middleware.ts:5](https://github.com/Sitecore/xmc-jss-dev/blob/f62fda45ad3407dd6bbe9ef6536a99934293651e/packages/nextjs/src/middleware/middleware.ts#L5)

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
