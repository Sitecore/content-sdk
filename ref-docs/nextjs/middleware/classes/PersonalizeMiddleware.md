[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PersonalizeMiddleware

# Class: PersonalizeMiddleware

Defined in: [nextjs/src/middleware/personalize-middleware.ts:47](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L47)

Middleware / handler to support Sitecore Personalize

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new PersonalizeMiddleware**(`config?`): `PersonalizeMiddleware`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L53)

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

Defined in: [nextjs/src/middleware/personalize-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L53)

Personalize middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L53)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### personalizeService

> `protected` **personalizeService**: [`PersonalizeService`](../../index/classes/PersonalizeService.md)

Defined in: [nextjs/src/middleware/personalize-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L48)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:54](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L54)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:220](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L220)

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

Defined in: [nextjs/src/middleware/middleware.ts:124](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L124)

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

Defined in: [nextjs/src/middleware/middleware.ts:192](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L192)

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

Defined in: [nextjs/src/middleware/personalize-middleware.ts:202](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L202)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`ExperienceParams`

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:160](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L160)

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

Defined in: [nextjs/src/middleware/middleware.ts:136](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L136)

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

Defined in: [nextjs/src/middleware/middleware.ts:152](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L152)

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

### getPersonalizeExecutions()

> `protected` **getPersonalizeExecutions**(`personalizeInfo`, `language`): `PersonalizeExecution`[]

Defined in: [nextjs/src/middleware/personalize-middleware.ts:287](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L287)

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

Defined in: [nextjs/src/middleware/middleware.ts:172](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L172)

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

Defined in: [nextjs/src/middleware/personalize-middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L76)

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

Defined in: [nextjs/src/middleware/personalize-middleware.ts:225](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L225)

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

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:79](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L79)

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

Defined in: [nextjs/src/middleware/middleware.ts:88](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L88)

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

Defined in: [nextjs/src/middleware/middleware.ts:67](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L67)

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

Defined in: [nextjs/src/middleware/personalize-middleware.ts:247](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/personalize-middleware.ts#L247)

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

Defined in: [nextjs/src/middleware/middleware.ts:203](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/nextjs/src/middleware/middleware.ts#L203)

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
