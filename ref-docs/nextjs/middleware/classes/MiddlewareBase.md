[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBase

# Class: `abstract` MiddlewareBase

Defined in: [nextjs/src/middleware/middleware.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L46)

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

Defined in: [nextjs/src/middleware/middleware.ts:51](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L51)

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

Defined in: [nextjs/src/middleware/middleware.ts:51](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L51)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:48](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L48)

***

### SITE\_SYMBOL

> `protected` **SITE\_SYMBOL**: `string` = `'sc_site'`

Defined in: [nextjs/src/middleware/middleware.ts:47](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L47)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:49](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L49)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:80](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L80)

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

Defined in: [nextjs/src/middleware/middleware.ts:97](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L97)

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

Defined in: [nextjs/src/middleware/middleware.ts:116](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L116)

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

Defined in: [nextjs/src/middleware/middleware.ts:108](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L108)

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

Defined in: [nextjs/src/middleware/middleware.ts:127](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L127)

Get site information.
Can not be used in **Preview** mode, since site will not be resolved

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

Defined in: [nextjs/src/middleware/middleware.ts:40](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L40)

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

Defined in: [nextjs/src/middleware/middleware.ts:73](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L73)

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

Defined in: [nextjs/src/middleware/middleware.ts:62](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L62)

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

Defined in: [nextjs/src/middleware/middleware.ts:144](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/nextjs/src/middleware/middleware.ts#L144)

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
