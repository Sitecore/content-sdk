[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyBaseConfig

# Type Alias: ProxyBaseConfig

> **ProxyBaseConfig** = `object`

Defined in: [nextjs/src/proxy/proxy.ts:17](https://github.com/Sitecore/content-sdk/blob/ecaa78f0077eae0acb0eb01fa2bce5c9dfea6ae3/packages/nextjs/src/proxy/proxy.ts#L17)

The interface for the Proxy configuration.

## Properties

### defaultHostname?

> `optional` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:28](https://github.com/Sitecore/content-sdk/blob/ecaa78f0077eae0acb0eb01fa2bce5c9dfea6ae3/packages/nextjs/src/proxy/proxy.ts#L28)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:33](https://github.com/Sitecore/content-sdk/blob/ecaa78f0077eae0acb0eb01fa2bce5c9dfea6ae3/packages/nextjs/src/proxy/proxy.ts#L33)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/proxy/proxy.ts:37](https://github.com/Sitecore/content-sdk/blob/ecaa78f0077eae0acb0eb01fa2bce5c9dfea6ae3/packages/nextjs/src/proxy/proxy.ts#L37)

Site resolution implementation by name/hostname

***

### skip()?

> `optional` **skip**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:23](https://github.com/Sitecore/content-sdk/blob/ecaa78f0077eae0acb0eb01fa2bce5c9dfea6ae3/packages/nextjs/src/proxy/proxy.ts#L23)

function, determines if proxy execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from proxy handler |
| `res` | `NextResponse` | response object from proxy handler |

#### Returns

`boolean`
