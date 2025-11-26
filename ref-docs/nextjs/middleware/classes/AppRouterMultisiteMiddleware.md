[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / AppRouterMultisiteMiddleware

# Class: AppRouterMultisiteMiddleware

Defined in: [nextjs/src/middleware/app-router-multisite-middleware.ts:8](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/app-router-multisite-middleware.ts#L8)

Middleware/handler for enabling multisite support in the Next.js App Router.

## Extends

- [`MultisiteMiddleware`](MultisiteMiddleware.md)

## Constructors

### Constructor

> **new AppRouterMultisiteMiddleware**(`config?`): `AppRouterMultisiteMiddleware`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/multisite-middleware.ts#L39)

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

Defined in: [nextjs/src/middleware/multisite-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/multisite-middleware.ts#L39)

Multisite middleware config

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`config`](MultisiteMiddleware.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:59](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L59)

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`defaultHostname`](MultisiteMiddleware.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:60](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L60)

#### Inherited from

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`siteResolver`](MultisiteMiddleware.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:136](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/multisite-middleware.ts#L136)

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

Defined in: [nextjs/src/middleware/middleware.ts:130](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L130)

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

Defined in: [nextjs/src/middleware/middleware.ts:198](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L198)

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

Defined in: [nextjs/src/middleware/middleware.ts:166](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L166)

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

Defined in: [nextjs/src/middleware/middleware.ts:142](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L142)

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

Defined in: [nextjs/src/middleware/middleware.ts:158](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L158)

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

Defined in: [nextjs/src/middleware/middleware.ts:178](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L178)

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

Defined in: [nextjs/src/middleware/app-router-multisite-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/app-router-multisite-middleware.ts#L39)

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

Defined in: [nextjs/src/middleware/multisite-middleware.ts:43](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/multisite-middleware.ts#L43)

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

Defined in: [nextjs/src/middleware/middleware.ts:85](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L85)

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

Defined in: [nextjs/src/middleware/middleware.ts:94](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L94)

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

Defined in: [nextjs/src/middleware/middleware.ts:73](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L73)

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

Defined in: [nextjs/src/middleware/middleware.ts:209](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/middleware.ts#L209)

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

***

### shouldSkipWhenDisabled()

> `protected` **shouldSkipWhenDisabled**(): `boolean`

Defined in: [nextjs/src/middleware/app-router-multisite-middleware.ts:29](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/app-router-multisite-middleware.ts#L29)

In App Router, we cannot skip the middleware even if enabled is false,
because the route structure requires the [site] segment.

#### Returns

`boolean`

always returns false (never skip) for App Router

#### Overrides

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`shouldSkipWhenDisabled`](MultisiteMiddleware.md#shouldskipwhendisabled)

***

### shouldWarnWhenDisabled()

> `protected` **shouldWarnWhenDisabled**(`_res`): `void`

Defined in: [nextjs/src/middleware/app-router-multisite-middleware.ts:15](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/nextjs/src/middleware/app-router-multisite-middleware.ts#L15)

Warns when multisite is disabled in App Router.
The middleware will still run to prevent routing errors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_res` | `NextResponse` | response (unused, kept for method signature compatibility) |

#### Returns

`void`

#### Overrides

[`MultisiteMiddleware`](MultisiteMiddleware.md).[`shouldWarnWhenDisabled`](MultisiteMiddleware.md#shouldwarnwhendisabled)
