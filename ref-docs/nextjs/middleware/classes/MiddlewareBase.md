[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MiddlewareBase

# Class: `abstract` MiddlewareBase

Defined in: [nextjs/src/middleware/middleware.ts:50](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L50)

Base middleware class with common methods

## Extends

- [`Middleware`](Middleware.md)

## Extended by

- [`RedirectsMiddleware`](RedirectsMiddleware.md)
- [`PersonalizeMiddleware`](PersonalizeMiddleware.md)
- [`MultisiteMiddleware`](MultisiteMiddleware.md)

## Constructors

### Constructor

> **new MiddlewareBase**(`config`): `MiddlewareBase`

Defined in: [nextjs/src/middleware/middleware.ts:54](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L54)

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

Defined in: [nextjs/src/middleware/middleware.ts:54](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L54)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L51)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L52)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:95](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L95)

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

Defined in: [nextjs/src/middleware/middleware.ts:112](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L112)

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

Defined in: [nextjs/src/middleware/middleware.ts:163](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L163)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:131](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L131)

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

Defined in: [nextjs/src/middleware/middleware.ts:123](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L123)

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

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:143](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L143)

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

Defined in: [nextjs/src/middleware/middleware.ts:44](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L44)

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

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L76)

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

Defined in: [nextjs/src/middleware/middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L65)

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

Defined in: [nextjs/src/middleware/middleware.ts:174](https://github.com/Sitecore/content-sdk/blob/3df14785f2b59cad81d791269b5f5c5e21cecb5b/packages/nextjs/src/middleware/middleware.ts#L174)

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
