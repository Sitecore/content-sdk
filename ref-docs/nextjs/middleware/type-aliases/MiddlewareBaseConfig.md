[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig** = `object`

Defined in: [nextjs/src/middleware/middleware.ts:13](https://github.com/Sitecore/content-sdk/blob/d754ac0e8d37843eada5c54739332febfe3d6948/packages/nextjs/src/middleware/middleware.ts#L13)

## Properties

### defaultHostname?

> `optional` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:24](https://github.com/Sitecore/content-sdk/blob/d754ac0e8d37843eada5c54739332febfe3d6948/packages/nextjs/src/middleware/middleware.ts#L24)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:29](https://github.com/Sitecore/content-sdk/blob/d754ac0e8d37843eada5c54739332febfe3d6948/packages/nextjs/src/middleware/middleware.ts#L29)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/middleware/middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/d754ac0e8d37843eada5c54739332febfe3d6948/packages/nextjs/src/middleware/middleware.ts#L33)

Site resolution implementation by name/hostname

***

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:19](https://github.com/Sitecore/content-sdk/blob/d754ac0e8d37843eada5c54739332febfe3d6948/packages/nextjs/src/middleware/middleware.ts#L19)

function, determines if middleware execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from middleware handler |
| `res` | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`
