[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyBaseConfig

# Type Alias: ProxyBaseConfig

> **ProxyBaseConfig** = `object`

Defined in: [nextjs/src/proxy/proxy.ts:31](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/nextjs/src/proxy/proxy.ts#L31)

The interface for the Proxy configuration.

## Properties

### defaultHostname?

> `optional` **defaultHostname?**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:42](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/nextjs/src/proxy/proxy.ts#L42)

Fallback hostname in case `host` header is not present

#### Default

```ts
localhost
```

***

### defaultLanguage?

> `optional` **defaultLanguage?**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:47](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/nextjs/src/proxy/proxy.ts#L47)

Fallback language in locale cannot be extracted from request URL

#### Default

```ts
'en'
```

***

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/proxy/proxy.ts:51](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/nextjs/src/proxy/proxy.ts#L51)

Site resolution implementation by name/hostname

***

### skip?

> `optional` **skip?**: (`req`, `res`) => `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:37](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/nextjs/src/proxy/proxy.ts#L37)

function, determines if proxy execution should be skipped, based on cookie, header, or other considerations

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request object from proxy handler |
| `res` | `NextResponse` | response object from proxy handler |

#### Returns

`boolean`
