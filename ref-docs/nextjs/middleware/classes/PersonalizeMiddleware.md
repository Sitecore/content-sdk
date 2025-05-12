[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PersonalizeMiddleware

# Class: PersonalizeMiddleware

Defined in: [nextjs/src/middleware/personalize-middleware.ts:47](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L47)

Middleware / handler to support Sitecore Personalize

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new PersonalizeMiddleware**(`config?`): `PersonalizeMiddleware`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L53)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`PersonalizeMiddlewareConfig`](../type-aliases/PersonalizeMiddlewareConfig.md) | Personalize middleware config |

#### Returns

`PersonalizeMiddleware`

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`constructor`](MiddlewareBase.md#constructor)

## Properties

### config

> `protected` **config**: [`PersonalizeMiddlewareConfig`](../type-aliases/PersonalizeMiddlewareConfig.md)

Defined in: [nextjs/src/middleware/personalize-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L53)

Personalize middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L51)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### personalizeService

> `protected` **personalizeService**: [`GraphQLPersonalizeService`](../../index/classes/GraphQLPersonalizeService.md)

Defined in: [nextjs/src/middleware/personalize-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L48)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L52)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:219](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L219)

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

Defined in: [nextjs/src/middleware/middleware.ts:100](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L100)

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

Defined in: [nextjs/src/middleware/middleware.ts:151](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L151)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`getClientFactory`](MiddlewareBase.md#getclientfactory)

***

### getExperienceParams()

> `protected` **getExperienceParams**(`req`): `ExperienceParams`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:201](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L201)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`ExperienceParams`

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:119](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L119)

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

Defined in: [nextjs/src/middleware/middleware.ts:111](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L111)

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

### getPersonalizeExecutions()

> `protected` **getPersonalizeExecutions**(`personalizeInfo`, `language`): `PersonalizeExecution`[]

Defined in: [nextjs/src/middleware/personalize-middleware.ts:286](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L286)

Aggregates personalize executions based on the provided route personalize information and language

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `personalizeInfo` | `PersonalizeInfo` | the route personalize information |
| `language` | `string` | the language |

#### Returns

`PersonalizeExecution`[]

An array of personalize executions

***

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:131](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L131)

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

Defined in: [nextjs/src/middleware/personalize-middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L76)

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

### initPersonalizeServer()

> `protected` **initPersonalizeServer**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/personalize-middleware.ts:224](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L224)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `hostname`: `string`; `request`: `NextRequest`; `response`: `NextResponse`; `siteName`: `string`; \} |
| `__namedParameters.hostname` | `string` |
| `__namedParameters.request` | `NextRequest` |
| `__namedParameters.response` | `NextResponse` |
| `__namedParameters.siteName` | `string` |

#### Returns

`Promise`\<`void`\>

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L76)

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

Defined in: [nextjs/src/middleware/middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L65)

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

### personalize()

> `protected` **personalize**(`__namedParameters`, `request`): `Promise`\<\{ `variantId`: `string`; \}\>

Defined in: [nextjs/src/middleware/personalize-middleware.ts:246](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/personalize-middleware.ts#L246)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `friendlyId`: `string`; `language`: `string`; `params`: `ExperienceParams`; `timeout?`: `number`; `variantIds?`: `string`[]; \} |
| `__namedParameters.friendlyId` | `string` |
| `__namedParameters.language` | `string` |
| `__namedParameters.params` | `ExperienceParams` |
| `__namedParameters.timeout?` | `number` |
| `__namedParameters.variantIds?` | `string`[] |
| `request` | `NextRequest` |

#### Returns

`Promise`\<\{ `variantId`: `string`; \}\>

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:162](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/nextjs/src/middleware/middleware.ts#L162)

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
