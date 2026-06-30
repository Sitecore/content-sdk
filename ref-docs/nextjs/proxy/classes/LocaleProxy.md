[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / LocaleProxy

# Class: LocaleProxy

Defined in: [nextjs/src/proxy/locale-proxy.ts:36](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/locale-proxy.ts#L36)

Proxy/handler for handling locale-based routing in the Next.js App Router.
This proxy is responsible for extracting the locale from the request path and rewriting it if necessary.
It also sets the locale header in the response.

## Extends

- [`ProxyBase`](ProxyBase.md)

## Constructors

### Constructor

> **new LocaleProxy**(`config`): `LocaleProxy`

Defined in: [nextjs/src/proxy/locale-proxy.ts:40](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/locale-proxy.ts#L40)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`LocaleProxyConfig`](../type-aliases/LocaleProxyConfig.md) | Locale proxy config |

#### Returns

`LocaleProxy`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`constructor`](ProxyBase.md#constructor)

## Properties

### config

> `protected` **config**: [`LocaleProxyConfig`](../type-aliases/LocaleProxyConfig.md)

Defined in: [nextjs/src/proxy/locale-proxy.ts:40](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/locale-proxy.ts#L40)

Locale proxy config

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`config`](ProxyBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:112](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L112)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`defaultHostname`](ProxyBase.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/proxy/proxy.ts:113](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L113)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`siteResolver`](ProxyBase.md#siteresolver)

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [nextjs/src/proxy/locale-proxy.ts:47](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/locale-proxy.ts#L47)

Name of the proxy, used as a key in the context to store information about executed proxies

##### Returns

`string`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`name`](ProxyBase.md#name)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `boolean` \| `undefined`

Defined in: [nextjs/src/proxy/locale-proxy.ts:128](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/locale-proxy.ts#L128)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`boolean` \| `undefined`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`disabled`](ProxyBase.md#disabled)

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:190](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L190)

Safely extract all headers for debug logging
Necessary to avoid proxy issue https://github.com/vercel/next.js/issues/39765

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingHeaders` | `Headers` | Incoming headers |

#### Returns

`object`

Object with headers as key/value pairs

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`extractDebugHeaders`](ProxyBase.md#extractdebugheaders)

***

### getClientFactory()

> `protected` **getClientFactory**(`graphQLOptions`): [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [nextjs/src/proxy/proxy.ts:260](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L260)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getClientFactory`](ProxyBase.md#getclientfactory)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:226](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L226)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`string`

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getHostHeader`](ProxyBase.md#gethostheader)

***

### getLanguage()

> `protected` **getLanguage**(`req`, `res?`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:202](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L202)

Provides used language

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`string`

language

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getLanguage`](ProxyBase.md#getlanguage)

***

### getLanguageFromHeader()

> `protected` **getLanguageFromHeader**(`res?`): `string` \| `undefined`

Defined in: [nextjs/src/proxy/proxy.ts:218](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L218)

Extract language from locale header of the response
set by LocaleProxy for app router application

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`string` \| `undefined`

language or undefined if not found

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getLanguageFromHeader`](ProxyBase.md#getlanguagefromheader)

***

### getLocaleFromPath()

> `protected` **getLocaleFromPath**(`path`): `string` \| `undefined`

Defined in: [nextjs/src/proxy/locale-proxy.ts:138](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/locale-proxy.ts#L138)

Extract locale from path

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | request path |

#### Returns

`string` \| `undefined`

the locale if found

***

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/proxy/proxy.ts:240](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L240)

Get site information. If site name is stored in cookie, use it, otherwise resolve by hostname
- If site can't be resolved by site name cookie use default site info based on provided parameters
- If site can't be resolved by hostname throw an error

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

[`SiteInfo`](../../index/type-aliases/SiteInfo.md)

site information

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getSite`](ProxyBase.md#getsite)

***

### handle()

> **handle**(`req`, `res`, `proxiesContext?`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/locale-proxy.ts:51](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/locale-proxy.ts#L51)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `proxiesContext?` | [`ProxiesContext`](../type-aliases/ProxiesContext.md) | context to share information between proxies |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Overrides

[`ProxyBase`](ProxyBase.md).[`handle`](ProxyBase.md#handle)

***

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:145](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L145)

Determines if the application is using the app router based on the locale header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res` | `NextResponse` | response |

#### Returns

`boolean`

true if app router is used

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`isAppRouter`](ProxyBase.md#isapprouter)

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:154](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L154)

Determines if the request is a Next.js (next/link) prefetch request

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is prefetch

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`isPrefetch`](ProxyBase.md#isprefetch)

***

### isPreview()

> `protected` **isPreview**(`req`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:133](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L133)

Determines if mode is preview

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is preview

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`isPreview`](ProxyBase.md#ispreview)

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/proxy/proxy.ts:271](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/proxy/proxy.ts#L271)

Create a rewrite response

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rewritePath` | `string` | the destionation path |
| `req` | `NextRequest` | the current request |
| `res` | `NextResponse` | the current response |
| `skipHeader?` | `boolean` | don't write 'x-sc-rewrite' header |

#### Returns

`NextResponse`

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`rewrite`](ProxyBase.md#rewrite)
