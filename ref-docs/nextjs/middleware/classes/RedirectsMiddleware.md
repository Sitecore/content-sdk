[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RedirectsMiddleware

# Class: RedirectsMiddleware

Defined in: [nextjs/src/middleware/redirects-middleware.ts:38](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/redirects-middleware.ts#L38)

Middleware / handler fetches all redirects from Sitecore instance by grapqhl service
compares with current url and redirects to target url

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### new RedirectsMiddleware()

> **new RedirectsMiddleware**(`config`?): [`RedirectsMiddleware`](RedirectsMiddleware.md)

Defined in: [nextjs/src/middleware/redirects-middleware.ts:45](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/redirects-middleware.ts#L45)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`RedirectsMiddlewareConfig`](../type-aliases/RedirectsMiddlewareConfig.md) | redirects middleware config |

#### Returns

[`RedirectsMiddleware`](RedirectsMiddleware.md)

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`constructor`](MiddlewareBase.md#constructors)

## Properties

### config

> `protected` **config**: [`RedirectsMiddlewareConfig`](../type-aliases/RedirectsMiddlewareConfig.md)

Defined in: [nextjs/src/middleware/redirects-middleware.ts:45](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/redirects-middleware.ts#L45)

redirects middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config-1)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:47](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L47)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### REWRITE\_HEADER\_NAME

> `protected` **REWRITE\_HEADER\_NAME**: `string` = `'x-sc-rewrite'`

Defined in: [nextjs/src/middleware/middleware.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L46)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`REWRITE_HEADER_NAME`](MiddlewareBase.md#rewrite_header_name)

***

### SITE\_SYMBOL

> `protected` **SITE\_SYMBOL**: `string` = `'sc_site'`

Defined in: [nextjs/src/middleware/middleware.ts:45](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L45)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`SITE_SYMBOL`](MiddlewareBase.md#site_symbol)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:48](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L48)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:79](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L79)

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

Defined in: [nextjs/src/middleware/middleware.ts:96](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L96)

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

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:115](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L115)

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

> `protected` **getLanguage**(`req`): `string`

Defined in: [nextjs/src/middleware/middleware.ts:107](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L107)

Provides used language

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`string`

language

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`getLanguage`](MiddlewareBase.md#getlanguage)

***

### getSite()

> `protected` **getSite**(`req`, `res`?): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:126](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L126)

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

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`getSite`](MiddlewareBase.md#getsite)

***

### handle()

> **handle**(`req`, `res`): `Promise`\<`NextResponse`\>

Defined in: [nextjs/src/middleware/redirects-middleware.ts:53](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/redirects-middleware.ts#L53)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\>

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`handle`](MiddlewareBase.md#handle)

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:72](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L72)

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

Defined in: [nextjs/src/middleware/middleware.ts:61](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L61)

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

> `protected` **rewrite**(`rewritePath`, `req`, `res`): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:142](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/nextjs/src/middleware/middleware.ts#L142)

Create a rewrite response

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rewritePath` | `string` | the destionation path |
| `req` | `NextRequest` | the current request |
| `res` | `NextResponse` | the current response |

#### Returns

`NextResponse`

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`rewrite`](MiddlewareBase.md#rewrite)
