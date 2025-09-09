[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MultisiteMiddleware

# Class: MultisiteMiddleware

Defined in: [nextjs/src/middleware/multisite-middleware.ts:30](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/multisite-middleware.ts#L30)

Middleware / handler for multisite support

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new MultisiteMiddleware**(`config?`): `MultisiteMiddleware`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/multisite-middleware.ts#L34)

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

Defined in: [nextjs/src/middleware/multisite-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/multisite-middleware.ts#L34)

Multisite middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L51)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L52)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:116](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/multisite-middleware.ts#L116)

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

Defined in: [nextjs/src/middleware/middleware.ts:112](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L112)

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

Defined in: [nextjs/src/middleware/middleware.ts:163](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L163)

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

Defined in: [nextjs/src/middleware/middleware.ts:131](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L131)

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

Defined in: [nextjs/src/middleware/middleware.ts:123](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L123)

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

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:143](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L143)

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

### handle()

> **handle**(`req`, `res`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/middleware/multisite-middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/multisite-middleware.ts#L38)

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

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L76)

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

Defined in: [nextjs/src/middleware/middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L65)

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

Defined in: [nextjs/src/middleware/middleware.ts:174](https://github.com/Sitecore/content-sdk/blob/baea9a2a6cbe5fc3daf90495c2c1933a2dccdc3b/packages/nextjs/src/middleware/middleware.ts#L174)

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
