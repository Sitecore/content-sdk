[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyBaseConfig

# Type Alias: ProxyBaseConfig

> **ProxyBaseConfig** = `object`

Defined in: [nextjs/src/proxy/proxy.ts:19](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/nextjs/src/proxy/proxy.ts#L19)

The interface for the Proxy configuration.

## Properties

### defaultHostname?

> `optional` **defaultHostname?**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:30](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/nextjs/src/proxy/proxy.ts#L30)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage?**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:35](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/nextjs/src/proxy/proxy.ts#L35)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/proxy/proxy.ts:39](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/nextjs/src/proxy/proxy.ts#L39)

Site resolution implementation by name/hostname

***

### skip?

> `optional` **skip?**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:25](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/nextjs/src/proxy/proxy.ts#L25)

function, determines if proxy execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from proxy handler |
| `res` | `NextResponse` | response object from proxy handler |

#### Returns

`boolean`
