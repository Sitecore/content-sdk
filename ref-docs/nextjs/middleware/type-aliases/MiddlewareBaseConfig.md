[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig**: `object`

Defined in: [nextjs/src/middleware/middleware.ts:5](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/nextjs/src/middleware/middleware.ts#L5)

## Type declaration

### defaultHostname?

> `optional` **defaultHostname**: `string`

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

### disabled()?

> `optional` **disabled**: (`req`, `res`) => `boolean`

function, determines if middleware should be turned off, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from middleware handler |
| `res` | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Site resolution implementation by name/hostname
