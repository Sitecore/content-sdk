[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PersonalizeMiddleware

# Class: PersonalizeMiddleware

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:47](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L47)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:47](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L47)
>>>>>>> dd686bb50 (Update API docs)

Middleware / handler to support Sitecore Personalize

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new PersonalizeMiddleware**(`config?`): `PersonalizeMiddleware`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L53)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L53)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L53)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L53)
>>>>>>> dd686bb50 (Update API docs)

Personalize middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L51)
=======
Defined in: [nextjs/src/middleware/middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L51)
>>>>>>> dd686bb50 (Update API docs)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### personalizeService

> `protected` **personalizeService**: [`PersonalizeService`](../../index/classes/PersonalizeService.md)

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L48)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L48)
>>>>>>> dd686bb50 (Update API docs)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L52)
=======
Defined in: [nextjs/src/middleware/middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L52)
>>>>>>> dd686bb50 (Update API docs)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:220](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L220)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:220](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L220)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:112](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L112)
=======
Defined in: [nextjs/src/middleware/middleware.ts:112](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L112)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:163](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L163)
=======
Defined in: [nextjs/src/middleware/middleware.ts:163](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L163)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:202](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L202)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:202](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L202)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`ExperienceParams`

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:131](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L131)
=======
Defined in: [nextjs/src/middleware/middleware.ts:131](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L131)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:123](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L123)
=======
Defined in: [nextjs/src/middleware/middleware.ts:123](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L123)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:287](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L287)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:287](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L287)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:143](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L143)
=======
Defined in: [nextjs/src/middleware/middleware.ts:143](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L143)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L76)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L76)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:225](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L225)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:225](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L225)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L76)
=======
Defined in: [nextjs/src/middleware/middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L76)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L65)
=======
Defined in: [nextjs/src/middleware/middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L65)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/personalize-middleware.ts:247](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/personalize-middleware.ts#L247)
=======
Defined in: [nextjs/src/middleware/personalize-middleware.ts:247](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/personalize-middleware.ts#L247)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:174](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L174)
=======
Defined in: [nextjs/src/middleware/middleware.ts:174](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L174)
>>>>>>> dd686bb50 (Update API docs)

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
