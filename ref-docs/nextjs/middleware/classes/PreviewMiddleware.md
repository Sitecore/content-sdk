[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PreviewMiddleware

# Class: PreviewMiddleware

Defined in: [nextjs/src/middleware/preview-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/preview-middleware.ts#L21)

Middleware for preview requests. Acts as a gateway for preview requests.
Currently it only supports internal editing hosts deployed on Sitecore AI.

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new PreviewMiddleware**(`config`): `PreviewMiddleware`

Defined in: [nextjs/src/middleware/preview-middleware.ts:24](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/preview-middleware.ts#L24)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`PreviewMiddlewareConfig`](../type-aliases/PreviewMiddlewareConfig.md) |

#### Returns

`PreviewMiddleware`

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`constructor`](MiddlewareBase.md#constructor)

## Properties

### client

> `protected` **client**: [`SitecoreClient`](../../client/classes/SitecoreClient.md)

Defined in: [nextjs/src/middleware/preview-middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/preview-middleware.ts#L22)

***

### config

> `protected` **config**: [`MiddlewareBaseConfig`](../type-aliases/MiddlewareBaseConfig.md)

Defined in: [nextjs/src/middleware/middleware.ts:62](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L62)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:59](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L59)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:60](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L60)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:113](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L113)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`undefined` \| `boolean`

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`disabled`](MiddlewareBase.md#disabled)

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:130](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L130)

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

Defined in: [nextjs/src/middleware/middleware.ts:198](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L198)

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

Defined in: [nextjs/src/middleware/middleware.ts:166](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L166)

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

Defined in: [nextjs/src/middleware/middleware.ts:142](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L142)

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

Defined in: [nextjs/src/middleware/middleware.ts:158](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L158)

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

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:178](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L178)

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

Defined in: [nextjs/src/middleware/preview-middleware.ts:30](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/preview-middleware.ts#L30)

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

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:85](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L85)

Determines if the application is using the app router based on the locale header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res` | `NextResponse` | response |

#### Returns

`boolean`

true if app router is used

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`isAppRouter`](MiddlewareBase.md#isapprouter)

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:94](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L94)

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

Defined in: [nextjs/src/middleware/middleware.ts:73](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L73)

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

Defined in: [nextjs/src/middleware/middleware.ts:209](https://github.com/Sitecore/content-sdk/blob/281de4e3a6d02a40839a722dfb9751fdae3998eb/packages/nextjs/src/middleware/middleware.ts#L209)

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
