[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBase

# Abstract Class: MiddlewareBase

Defined in: [nextjs/src/middleware/middleware.ts:58](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L58)

Base middleware class with common methods

## Extends

- [`Middleware`](Middleware.md)

## Extended by

- [`RedirectsMiddleware`](RedirectsMiddleware.md)
- [`PersonalizeMiddleware`](PersonalizeMiddleware.md)
- [`MultisiteMiddleware`](MultisiteMiddleware.md)
- [`LocaleMiddleware`](LocaleMiddleware.md)

## Constructors

### Constructor

> **new MiddlewareBase**(`config`): `MiddlewareBase`

Defined in: [nextjs/src/middleware/middleware.ts:62](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L62)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`MiddlewareBaseConfig`](../type-aliases/MiddlewareBaseConfig.md) |

#### Returns

`MiddlewareBase`

#### Overrides

[`Middleware`](Middleware.md).[`constructor`](Middleware.md#constructor)

## Properties

### config

> `protected` **config**: [`MiddlewareBaseConfig`](../type-aliases/MiddlewareBaseConfig.md)

Defined in: [nextjs/src/middleware/middleware.ts:62](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L62)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:59](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L59)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:60](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L60)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:113](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L113)

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

Defined in: [nextjs/src/middleware/middleware.ts:130](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L130)

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

### getClientFactory()

> `protected` **getClientFactory**(`graphQLOptions`): [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [nextjs/src/middleware/middleware.ts:198](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L198)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:166](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L166)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`undefined` \| `string`

***

### getLanguage()

> `protected` **getLanguage**(`req`, `res?`): `string`

Defined in: [nextjs/src/middleware/middleware.ts:142](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L142)

Provides used language

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`string`

language

***

### getLanguageFromHeader()

> `protected` **getLanguageFromHeader**(`res?`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:158](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L158)

Extract language from locale header of the response
set by LocaleMiddleware for app router application

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`undefined` \| `string`

language or undefined if not found

***

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:178](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L178)

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

***

### handle()

> `abstract` **handle**(`req`, `res`, `ev`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/middleware/middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L51)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `ev` | `NextFetchEvent` | fetch event |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Inherited from

[`Middleware`](Middleware.md).[`handle`](Middleware.md#handle)

***

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:85](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L85)

Determines if the application is using the app router based on the locale header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res` | `NextResponse` | response |

#### Returns

`boolean`

true if app router is used

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:94](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L94)

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

Defined in: [nextjs/src/middleware/middleware.ts:73](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L73)

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

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:209](https://github.com/Sitecore/content-sdk/blob/63252e0290b61f21cc14fef821285d75a991d463/packages/nextjs/src/middleware/middleware.ts#L209)

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
