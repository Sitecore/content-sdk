[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyBaseConfig

# Type Alias: ProxyBaseConfig

> **ProxyBaseConfig** = `object`

Defined in: [nextjs/src/proxy/proxy.ts:24](https://github.com/Sitecore/content-sdk/blob/0e7dce683a0be4b8942bf4dc050856cd3c28ba07/packages/nextjs/src/proxy/proxy.ts#L24)

The interface for the Proxy configuration.

## Properties

### defaultHostname?

> `optional` **defaultHostname?**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:35](https://github.com/Sitecore/content-sdk/blob/0e7dce683a0be4b8942bf4dc050856cd3c28ba07/packages/nextjs/src/proxy/proxy.ts#L35)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage?**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:40](https://github.com/Sitecore/content-sdk/blob/0e7dce683a0be4b8942bf4dc050856cd3c28ba07/packages/nextjs/src/proxy/proxy.ts#L40)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/proxy/proxy.ts:44](https://github.com/Sitecore/content-sdk/blob/0e7dce683a0be4b8942bf4dc050856cd3c28ba07/packages/nextjs/src/proxy/proxy.ts#L44)

Site resolution implementation by name/hostname

***

### skip?

> `optional` **skip?**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:30](https://github.com/Sitecore/content-sdk/blob/0e7dce683a0be4b8942bf4dc050856cd3c28ba07/packages/nextjs/src/proxy/proxy.ts#L30)

function, determines if proxy execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from proxy handler |
| `res` | `NextResponse` | response object from proxy handler |

#### Returns

`boolean`
