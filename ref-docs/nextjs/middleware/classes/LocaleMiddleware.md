[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / LocaleMiddleware

# Class: LocaleMiddleware

Defined in: [nextjs/src/middleware/locale-middleware.ts:23](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/locale-middleware.ts#L23)

Middleware/handler for handling locale-based routing in the Next.js App Router.
This middleware is responsible for extracting the locale from the request path and rewriting it if necessary.
It also sets the locale header in the response.

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new LocaleMiddleware**(`config`): `LocaleMiddleware`

Defined in: [nextjs/src/middleware/locale-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/locale-middleware.ts#L27)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`LocaleMiddlewareConfig`](../type-aliases/LocaleMiddlewareConfig.md) | Locale middleware config |

#### Returns

`LocaleMiddleware`

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`constructor`](MiddlewareBase.md#constructor)

## Properties

### config

> `protected` **config**: [`LocaleMiddlewareConfig`](../type-aliases/LocaleMiddlewareConfig.md)

Defined in: [nextjs/src/middleware/locale-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/locale-middleware.ts#L27)

Locale middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L52)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L53)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/locale-middleware.ts:78](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/locale-middleware.ts#L78)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`undefined` \| `boolean`

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`disabled`](MiddlewareBase.md#disabled)

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:113](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L113)

Safely extract all headers for debug logging
Necessary to avoid middleware issue https://github.com/vercel/next.js/issues/39765

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingHeaders` | `Headers` | Incoming headers |

#### Returns

`object`

Object with headers as key/value pairs

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`extractDebugHeaders`](MiddlewareBase.md#extractdebugheaders)

***

### getClientFactory()

> `protected` **getClientFactory**(`graphQLOptions`): [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [nextjs/src/middleware/middleware.ts:181](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L181)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`getClientFactory`](MiddlewareBase.md#getclientfactory)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:149](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L149)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`undefined` \| `string`

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`getHostHeader`](MiddlewareBase.md#gethostheader)

***

### getLanguage()

> `protected` **getLanguage**(`req`, `res?`): `string`

Defined in: [nextjs/src/middleware/middleware.ts:125](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L125)

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

[`MiddlewareBase`](MiddlewareBase.md).[`getLanguage`](MiddlewareBase.md#getlanguage)

***

### getLanguageFromHeader()

> `protected` **getLanguageFromHeader**(`res?`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:141](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L141)

Extract language from locale header of the response
set by LocaleMiddleware for app router application

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`undefined` \| `string`

language or undefined if not found

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`getLanguageFromHeader`](MiddlewareBase.md#getlanguagefromheader)

***

### getLocaleFromPath()

> `protected` **getLocaleFromPath**(`path`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/locale-middleware.ts:88](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/locale-middleware.ts#L88)

Extract locale from path

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | request path |

#### Returns

`undefined` \| `string`

the locale if found

***

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:161](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L161)

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

[`MiddlewareBase`](MiddlewareBase.md).[`getSite`](MiddlewareBase.md#getsite)

***

### handle()

> **handle**(`req`, `res`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/middleware/locale-middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/locale-middleware.ts#L31)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`handle`](MiddlewareBase.md#handle)

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:77](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L77)

Determines if the request is a Next.js (next/link) prefetch request

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is prefetch

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`isPrefetch`](MiddlewareBase.md#isprefetch)

***

### isPreview()

> `protected` **isPreview**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:66](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L66)

Determines if mode is preview

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is preview

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`isPreview`](MiddlewareBase.md#ispreview)

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:192](https://github.com/Sitecore/content-sdk/blob/e614f9898cdcddf62ed7ac3f0b877414346454a3/packages/nextjs/src/middleware/middleware.ts#L192)

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

[`MiddlewareBase`](MiddlewareBase.md).[`rewrite`](MiddlewareBase.md#rewrite)
