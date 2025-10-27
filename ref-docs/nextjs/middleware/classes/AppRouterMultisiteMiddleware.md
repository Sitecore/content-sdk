[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / AppRouterMultisiteMiddleware

# Class: AppRouterMultisiteMiddleware

Defined in: [nextjs/src/middleware/app-router-multisite-middleware.ts:6](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/app-router-multisite-middleware.ts#L6)

Middleware/handler for enabling multisite support in the Next.js App Router.

## Extends

- [`MultisiteMiddleware`](MultisiteMiddleware.md)

## Constructors

### Constructor

> **new AppRouterMultisiteMiddleware**(`config?`): `AppRouterMultisiteMiddleware`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/multisite-middleware.ts#L34)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`MultisiteMiddlewareConfig`](../type-aliases/MultisiteMiddlewareConfig.md) | Multisite middleware config |

#### Returns

`AppRouterMultisiteMiddleware`

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`constructor`](MultisiteMiddleware.md#constructor)

## Properties

### config

> `protected` **config**: [`MultisiteMiddlewareConfig`](../type-aliases/MultisiteMiddlewareConfig.md)

Defined in: [nextjs/src/middleware/multisite-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/multisite-middleware.ts#L34)

Multisite middleware config

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`config`](MultisiteMiddleware.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L53)

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`defaultHostname`](MultisiteMiddleware.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:54](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L54)

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`siteResolver`](MultisiteMiddleware.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:125](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/multisite-middleware.ts#L125)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`undefined` \| `boolean`

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`disabled`](MultisiteMiddleware.md#disabled)

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:124](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L124)

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

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`extractDebugHeaders`](MultisiteMiddleware.md#extractdebugheaders)

***

### getClientFactory()

> `protected` **getClientFactory**(`graphQLOptions`): [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [nextjs/src/middleware/middleware.ts:192](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L192)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`getClientFactory`](MultisiteMiddleware.md#getclientfactory)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:160](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L160)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`undefined` \| `string`

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`getHostHeader`](MultisiteMiddleware.md#gethostheader)

***

### getLanguage()

> `protected` **getLanguage**(`req`, `res?`): `string`

Defined in: [nextjs/src/middleware/middleware.ts:136](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L136)

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

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`getLanguage`](MultisiteMiddleware.md#getlanguage)

***

### getLanguageFromHeader()

> `protected` **getLanguageFromHeader**(`res?`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:152](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L152)

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

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`getLanguageFromHeader`](MultisiteMiddleware.md#getlanguagefromheader)

***

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:172](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L172)

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

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`getSite`](MultisiteMiddleware.md#getsite)

***

### getSiteRewrite()

> `protected` **getSiteRewrite**(`pathname`, `siteName`): `string`

Defined in: [nextjs/src/middleware/app-router-multisite-middleware.ts:13](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/app-router-multisite-middleware.ts#L13)

Generates a site-specific rewrite path for app router based on the provided pathname and site name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pathname` | `string` | The pathname to be rewritten. |
| `siteName` | `string` | The name of the site. |

#### Returns

`string`

The rewritten path as a string.

#### Overrides

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`getSiteRewrite`](MultisiteMiddleware.md#getsiterewrite)

***

### handle()

> **handle**(`req`, `res`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/middleware/multisite-middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/multisite-middleware.ts#L38)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`handle`](MultisiteMiddleware.md#handle)

***

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:79](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L79)

Determines if the application is using the app router based on the locale header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res` | `NextResponse` | response |

#### Returns

`boolean`

true if app router is used

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`isAppRouter`](MultisiteMiddleware.md#isapprouter)

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:88](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L88)

Determines if the request is a Next.js (next/link) prefetch request

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is prefetch

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`isPrefetch`](MultisiteMiddleware.md#isprefetch)

***

### isPreview()

> `protected` **isPreview**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:67](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L67)

Determines if mode is preview

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is preview

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`isPreview`](MultisiteMiddleware.md#ispreview)

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:203](https://github.com/Sitecore/content-sdk/blob/dc04f1c487753e06395b0c207587f39f42c029db/packages/nextjs/src/middleware/middleware.ts#L203)

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

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`rewrite`](MultisiteMiddleware.md#rewrite)
