[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBase

# Abstract Class: MiddlewareBase

Defined in: [nextjs/src/middleware/middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L52)

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

Defined in: [nextjs/src/middleware/middleware.ts:56](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L56)

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

Defined in: [nextjs/src/middleware/middleware.ts:56](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L56)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L53)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:54](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L54)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:107](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L107)

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

Defined in: [nextjs/src/middleware/middleware.ts:124](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L124)

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

Defined in: [nextjs/src/middleware/middleware.ts:192](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L192)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:160](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L160)

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

Defined in: [nextjs/src/middleware/middleware.ts:136](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L136)

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

Defined in: [nextjs/src/middleware/middleware.ts:152](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L152)

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

Defined in: [nextjs/src/middleware/middleware.ts:172](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L172)

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

Defined in: [nextjs/src/middleware/middleware.ts:46](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L46)

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

Defined in: [nextjs/src/middleware/middleware.ts:79](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L79)

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

Defined in: [nextjs/src/middleware/middleware.ts:88](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L88)

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

Defined in: [nextjs/src/middleware/middleware.ts:67](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L67)

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

Defined in: [nextjs/src/middleware/middleware.ts:203](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/nextjs/src/middleware/middleware.ts#L203)

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
