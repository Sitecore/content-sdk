[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyBaseConfig

# Type Alias: ProxyBaseConfig

> **ProxyBaseConfig** = `object`

Defined in: [nextjs/src/proxy/proxy.ts:18](https://github.com/Sitecore/content-sdk/blob/e4d25a1361f2e4c7054948e8cb31a3639dc89fb9/packages/nextjs/src/proxy/proxy.ts#L18)

The interface for the Proxy configuration.

## Properties

### defaultHostname?

> `optional` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:29](https://github.com/Sitecore/content-sdk/blob/e4d25a1361f2e4c7054948e8cb31a3639dc89fb9/packages/nextjs/src/proxy/proxy.ts#L29)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:34](https://github.com/Sitecore/content-sdk/blob/e4d25a1361f2e4c7054948e8cb31a3639dc89fb9/packages/nextjs/src/proxy/proxy.ts#L34)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/proxy/proxy.ts:38](https://github.com/Sitecore/content-sdk/blob/e4d25a1361f2e4c7054948e8cb31a3639dc89fb9/packages/nextjs/src/proxy/proxy.ts#L38)

Site resolution implementation by name/hostname

***

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:24](https://github.com/Sitecore/content-sdk/blob/e4d25a1361f2e4c7054948e8cb31a3639dc89fb9/packages/nextjs/src/proxy/proxy.ts#L24)

function, determines if proxy execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from proxy handler |
| `res` | `NextResponse` | response object from proxy handler |

#### Returns

`boolean`
