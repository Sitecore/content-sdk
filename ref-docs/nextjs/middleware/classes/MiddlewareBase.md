[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBase

# Class: `abstract` MiddlewareBase

Defined in: [nextjs/src/middleware/middleware.ts:30](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L30)

## Extended by

- [`RedirectsMiddleware`](RedirectsMiddleware.md)
- [`PersonalizeMiddleware`](PersonalizeMiddleware.md)
- [`MultisiteMiddleware`](MultisiteMiddleware.md)

## Constructors

### new MiddlewareBase()

> **new MiddlewareBase**(`config`): [`MiddlewareBase`](MiddlewareBase.md)

Defined in: [nextjs/src/middleware/middleware.ts:35](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L35)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`MiddlewareBaseConfig`](../type-aliases/MiddlewareBaseConfig.md) |

#### Returns

[`MiddlewareBase`](MiddlewareBase.md)

## Properties

### config

> `protected` **config**: [`MiddlewareBaseConfig`](../type-aliases/MiddlewareBaseConfig.md)

Defined in: [nextjs/src/middleware/middleware.ts:35](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L35)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L33)

***

### REWRITE\_HEADER\_NAME

> `protected` **REWRITE\_HEADER\_NAME**: `string` = `'x-sc-rewrite'`

Defined in: [nextjs/src/middleware/middleware.ts:32](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L32)

***

### SITE\_SYMBOL

> `protected` **SITE\_SYMBOL**: `string` = `'sc_site'`

Defined in: [nextjs/src/middleware/middleware.ts:31](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L31)

## Methods

### excludeRoute()

> `protected` **excludeRoute**(`pathname`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:62](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L62)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pathname` | `string` |

#### Returns

`undefined` \| `boolean`

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:77](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L77)

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

Defined in: [nextjs/src/middleware/middleware.ts:96](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L96)

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

Defined in: [nextjs/src/middleware/middleware.ts:88](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L88)

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

Defined in: [nextjs/src/middleware/middleware.ts:107](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L107)

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

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:55](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L55)

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

Defined in: [nextjs/src/middleware/middleware.ts:44](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L44)

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

> `protected` **rewrite**(`rewritePath`, `req`, `res`): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:123](https://github.com/Sitecore/xmc-jss-dev/blob/c05a522c5533cbbabb306233de7c60e3deff8ed5/packages/nextjs/src/middleware/middleware.ts#L123)

Create a rewrite response

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rewritePath` | `string` | the destionation path |
| `req` | `NextRequest` | the current request |
| `res` | `NextResponse` | the current response |

#### Returns

`NextResponse`
