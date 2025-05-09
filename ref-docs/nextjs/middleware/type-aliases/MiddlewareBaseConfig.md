[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBaseConfig

# Type Alias: MiddlewareBaseConfig

> **MiddlewareBaseConfig** = `object`

Defined in: [nextjs/src/middleware/middleware.ts:7](https://github.com/Sitecore/content-sdk/blob/fccbe3bad054195743d198c26551a80a85bb7ddc/packages/nextjs/src/middleware/middleware.ts#L7)

## Properties

### defaultHostname?

> `optional` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/fccbe3bad054195743d198c26551a80a85bb7ddc/packages/nextjs/src/middleware/middleware.ts#L18)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:23](https://github.com/Sitecore/content-sdk/blob/fccbe3bad054195743d198c26551a80a85bb7ddc/packages/nextjs/src/middleware/middleware.ts#L23)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/middleware/middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/fccbe3bad054195743d198c26551a80a85bb7ddc/packages/nextjs/src/middleware/middleware.ts#L27)

Site resolution implementation by name/hostname

***

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:13](https://github.com/Sitecore/content-sdk/blob/fccbe3bad054195743d198c26551a80a85bb7ddc/packages/nextjs/src/middleware/middleware.ts#L13)

function, determines if middleware execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from middleware handler |
| `res` | `NextResponse` | response object from middleware handler |

#### Returns

`boolean`
