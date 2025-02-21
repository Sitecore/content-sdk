[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PersonalizeMiddleware

# Class: PersonalizeMiddleware

Defined in: [nextjs/src/middleware/personalize-middleware.ts:79](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L79)

Middleware / handler to support Sitecore Personalize

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### new PersonalizeMiddleware()

> **new PersonalizeMiddleware**(`config`?): [`PersonalizeMiddleware`](PersonalizeMiddleware.md)

Defined in: [nextjs/src/middleware/personalize-middleware.ts:85](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L85)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`PersonalizeMiddlewareConfig`](../type-aliases/PersonalizeMiddlewareConfig.md) | Personalize middleware config |

#### Returns

[`PersonalizeMiddleware`](PersonalizeMiddleware.md)

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`constructor`](MiddlewareBase.md#constructors)

## Properties

### config

> `protected` **config**: [`PersonalizeMiddlewareConfig`](../type-aliases/PersonalizeMiddlewareConfig.md)

Defined in: [nextjs/src/middleware/personalize-middleware.ts:85](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L85)

Personalize middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config-1)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:42](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L42)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### REWRITE\_HEADER\_NAME

> `protected` **REWRITE\_HEADER\_NAME**: `string` = `'x-sc-rewrite'`

Defined in: [nextjs/src/middleware/middleware.ts:41](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L41)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`REWRITE_HEADER_NAME`](MiddlewareBase.md#rewrite_header_name)

***

### SITE\_SYMBOL

> `protected` **SITE\_SYMBOL**: `string` = `'sc_site'`

Defined in: [nextjs/src/middleware/middleware.ts:40](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L40)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`SITE_SYMBOL`](MiddlewareBase.md#site_symbol)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:290](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L290)

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

Defined in: [nextjs/src/middleware/middleware.ts:89](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L89)

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

### getExperienceParams()

> `protected` **getExperienceParams**(`req`): `ExperienceParams`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:273](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L273)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`ExperienceParams`

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:108](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L108)

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

Defined in: [nextjs/src/middleware/middleware.ts:100](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L100)

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

Defined in: [nextjs/src/middleware/personalize-middleware.ts:301](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L301)

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

> `protected` **getSite**(`req`, `res`?): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:119](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L119)

Get site information.
Can not be used in **Preview** mode, since site will not be resolved

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res`? | `NextResponse` | response |

#### Returns

[`SiteInfo`](../../index/type-aliases/SiteInfo.md)

site information

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`getSite`](MiddlewareBase.md#getsite)

***

### handle()

> **handle**(`req`, `res`): `Promise`\<`NextResponse`\>

Defined in: [nextjs/src/middleware/personalize-middleware.ts:96](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L96)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\>

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`handle`](MiddlewareBase.md#handle)

***

### initPersonalizeServer()

> `protected` **initPersonalizeServer**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/personalize-middleware.ts:217](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L217)

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

Defined in: [nextjs/src/middleware/middleware.ts:65](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L65)

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

Defined in: [nextjs/src/middleware/middleware.ts:54](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L54)

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

Defined in: [nextjs/src/middleware/personalize-middleware.ts:239](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/personalize-middleware.ts#L239)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `friendlyId`: `string`; `language`: `string`; `params`: `ExperienceParams`; `timeout`: `number`; `variantIds`: `string`[]; \} |
| `__namedParameters.friendlyId` | `string` |
| `__namedParameters.language` | `string` |
| `__namedParameters.params` | `ExperienceParams` |
| `__namedParameters.timeout`? | `number` |
| `__namedParameters.variantIds`? | `string`[] |
| `request` | `NextRequest` |

#### Returns

`Promise`\<\{ `variantId`: `string`; \}\>

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:135](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/middleware.ts#L135)

Create a rewrite response

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rewritePath` | `string` | the destionation path |
| `req` | `NextRequest` | the current request |
| `res` | `NextResponse` | the current response |

#### Returns

`NextResponse`

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`rewrite`](MiddlewareBase.md#rewrite)
