[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBase

# Class: `abstract` MiddlewareBase

Defined in: [nextjs/src/middleware/middleware.ts:46](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L46)

Base middleware class with common methods

## Extends

- [`Middleware`](Middleware.md)

## Extended by

- [`RedirectsMiddleware`](RedirectsMiddleware.md)
- [`PersonalizeMiddleware`](PersonalizeMiddleware.md)
- [`MultisiteMiddleware`](MultisiteMiddleware.md)

## Constructors

### new MiddlewareBase()

> **new MiddlewareBase**(`config`): [`MiddlewareBase`](MiddlewareBase.md)

Defined in: [nextjs/src/middleware/middleware.ts:50](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L50)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`MiddlewareBaseConfig`](../type-aliases/MiddlewareBaseConfig.md) |

#### Returns

[`MiddlewareBase`](MiddlewareBase.md)

#### Overrides

[`Middleware`](Middleware.md).[`constructor`](Middleware.md#constructors)

## Properties

### config

> `protected` **config**: [`MiddlewareBaseConfig`](../type-aliases/MiddlewareBaseConfig.md)

Defined in: [nextjs/src/middleware/middleware.ts:50](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L50)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:47](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L47)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L48)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:79](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L79)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`undefined` \| `boolean`

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:96](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L96)

Safely extract all headers for debug logging
Necessary to avoid middleware issue https://github.com/vercel/next.js/issues/39765

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingHeaders` | `Headers` | Incoming headers |

#### Returns

`object`

Object with headers as key/value pairs

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:115](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L115)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`undefined` \| `string`

***

### getLanguage()

> `protected` **getLanguage**(`req`): `string`

Defined in: [nextjs/src/middleware/middleware.ts:107](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L107)

Provides used language

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`string`

language

***

### getSite()

> `protected` **getSite**(`req`, `res`?): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:127](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L127)

Get site information. If site name is stored in cookie, use it, otherwise resolve by hostname
- If site can't be resolved by site name cookie use default site info based on provided parameters
- If site can't be resolved by hostname throw an error

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res`? | `NextResponse` | response |

#### Returns

[`SiteInfo`](../../index/type-aliases/SiteInfo.md)

site information

***

### handle()

> `abstract` **handle**(`req`, `res`, `ev`): `Promise`\<`NextResponse`\>

Defined in: [nextjs/src/middleware/middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L40)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `ev` | `NextFetchEvent` | fetch event |

#### Returns

`Promise`\<`NextResponse`\>

#### Inherited from

[`Middleware`](Middleware.md).[`handle`](Middleware.md#handle)

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:72](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L72)

Determines if the request is a Next.js (next/link) prefetch request

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is prefetch

***

### isPreview()

> `protected` **isPreview**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:61](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L61)

Determines if mode is preview

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is preview

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader`?): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:154](https://github.com/Sitecore/content-sdk/blob/bfe672d212140ef15b86f850b9fb38de51521218/packages/nextjs/src/middleware/middleware.ts#L154)

Create a rewrite response

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rewritePath` | `string` | the destionation path |
| `req` | `NextRequest` | the current request |
| `res` | `NextResponse` | the current response |
| `skipHeader`? | `boolean` | don't write 'x-sc-rewrite' header |

#### Returns

`NextResponse`
