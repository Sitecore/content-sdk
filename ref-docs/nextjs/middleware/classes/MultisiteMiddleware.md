[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MultisiteMiddleware

# Class: MultisiteMiddleware

Defined in: [nextjs/src/middleware/multisite-middleware.ts:30](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/multisite-middleware.ts#L30)

Middleware / handler for multisite support

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Extended by

- [`AppRouterMultisiteMiddleware`](AppRouterMultisiteMiddleware.md)

## Constructors

### Constructor

> **new MultisiteMiddleware**(`config?`): `MultisiteMiddleware`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/multisite-middleware.ts#L34)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`MultisiteMiddlewareConfig`](../type-aliases/MultisiteMiddlewareConfig.md) | Multisite middleware config |

#### Returns

`MultisiteMiddleware`

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`constructor`](MiddlewareBase.md#constructor)

## Properties

### config

> `protected` **config**: [`MultisiteMiddlewareConfig`](../type-aliases/MultisiteMiddlewareConfig.md)

Defined in: [nextjs/src/middleware/multisite-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/multisite-middleware.ts#L34)

Multisite middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L52)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L53)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:117](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/multisite-middleware.ts#L117)

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

Defined in: [nextjs/src/middleware/middleware.ts:122](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L122)

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

Defined in: [nextjs/src/middleware/middleware.ts:190](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L190)

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

Defined in: [nextjs/src/middleware/middleware.ts:158](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L158)

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

Defined in: [nextjs/src/middleware/middleware.ts:134](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L134)

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

Defined in: [nextjs/src/middleware/middleware.ts:150](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L150)

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

Defined in: [nextjs/src/middleware/middleware.ts:170](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L170)

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

### getSiteRewrite()

> `protected` **getSiteRewrite**(`pathname`, `siteName`): `string`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:128](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/multisite-middleware.ts#L128)

Generates a site-specific rewrite path based on the provided pathname and site name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pathname` | `string` | The pathname to be rewritten. |
| `siteName` | `string` | The name of the site. |

#### Returns

`string`

The rewritten path as a string.

***

### handle()

> **handle**(`req`, `res`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/middleware/multisite-middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/multisite-middleware.ts#L38)

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

Defined in: [nextjs/src/middleware/middleware.ts:77](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L77)

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

Defined in: [nextjs/src/middleware/middleware.ts:86](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L86)

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

Defined in: [nextjs/src/middleware/middleware.ts:66](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L66)

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

Defined in: [nextjs/src/middleware/middleware.ts:201](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/nextjs/src/middleware/middleware.ts#L201)

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
