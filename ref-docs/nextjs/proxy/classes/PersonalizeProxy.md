[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / PersonalizeProxy

# Class: PersonalizeProxy

Defined in: [nextjs/src/proxy/personalize-proxy.ts:84](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L84)

Proxy / handler to support Sitecore Personalize

## Extends

- [`ProxyBase`](ProxyBase.md)

## Constructors

### Constructor

> **new PersonalizeProxy**(`config?`): `PersonalizeProxy`

Defined in: [nextjs/src/proxy/personalize-proxy.ts:90](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L90)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`PersonalizeProxyConfig`](../type-aliases/PersonalizeProxyConfig.md) | Personalize proxy config |

#### Returns

`PersonalizeProxy`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`constructor`](ProxyBase.md#constructor)

## Properties

### config

> `protected` **config**: [`PersonalizeProxyConfig`](../type-aliases/PersonalizeProxyConfig.md)

Defined in: [nextjs/src/proxy/personalize-proxy.ts:90](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L90)

Personalize proxy config

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`config`](ProxyBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:112](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L112)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`defaultHostname`](ProxyBase.md#defaulthostname)

***

### personalizeService

> `protected` **personalizeService**: [`PersonalizeService`](../../index/classes/PersonalizeService.md) \| `null`

Defined in: [nextjs/src/proxy/personalize-proxy.ts:85](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L85)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/proxy/proxy.ts:113](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L113)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`siteResolver`](ProxyBase.md#siteresolver)

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [nextjs/src/proxy/personalize-proxy.ts:128](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L128)

Name of the proxy, used as a key in the context to store information about executed proxies

##### Returns

`string`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`name`](ProxyBase.md#name)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `boolean` \| `undefined`

Defined in: [nextjs/src/proxy/personalize-proxy.ts:291](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L291)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`boolean` \| `undefined`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`disabled`](ProxyBase.md#disabled)

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:190](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L190)

Safely extract all headers for debug logging
Necessary to avoid proxy issue https://github.com/vercel/next.js/issues/39765

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingHeaders` | `Headers` | Incoming headers |

#### Returns

`object`

Object with headers as key/value pairs

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`extractDebugHeaders`](ProxyBase.md#extractdebugheaders)

***

### getClientFactory()

> `protected` **getClientFactory**(`graphQLOptions`): [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [nextjs/src/proxy/proxy.ts:260](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L260)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getClientFactory`](ProxyBase.md#getclientfactory)

***

### getExperienceParams()

> `protected` **getExperienceParams**(`req`): `ExperienceParams`

Defined in: [nextjs/src/proxy/personalize-proxy.ts:301](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L301)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`ExperienceParams`

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:226](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L226)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`string`

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getHostHeader`](ProxyBase.md#gethostheader)

***

### getLanguage()

> `protected` **getLanguage**(`req`, `res?`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:202](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L202)

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

[`ProxyBase`](ProxyBase.md).[`getLanguage`](ProxyBase.md#getlanguage)

***

### getLanguageFromHeader()

> `protected` **getLanguageFromHeader**(`res?`): `string` \| `undefined`

Defined in: [nextjs/src/proxy/proxy.ts:218](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L218)

Extract language from locale header of the response
set by LocaleProxy for app router application

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`string` \| `undefined`

language or undefined if not found

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getLanguageFromHeader`](ProxyBase.md#getlanguagefromheader)

***

### getPersonalizeExecutions()

> `protected` **getPersonalizeExecutions**(`personalizeInfo`, `language`): `PersonalizeExecution`[]

Defined in: [nextjs/src/proxy/personalize-proxy.ts:393](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L393)

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

Defined in: [nextjs/src/proxy/proxy.ts:240](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L240)

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

[`ProxyBase`](ProxyBase.md).[`getSite`](ProxyBase.md#getsite)

***

### handle()

> **handle**(`req`, `res`, `proxiesContext?`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/personalize-proxy.ts:132](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L132)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `proxiesContext?` | [`ProxiesContext`](../type-aliases/ProxiesContext.md) | context to share information between proxies |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Overrides

[`ProxyBase`](ProxyBase.md).[`handle`](ProxyBase.md#handle)

***

### initPersonalizeServer()

> `protected` **initPersonalizeServer**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [nextjs/src/proxy/personalize-proxy.ts:319](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L319)

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

Defined in: [nextjs/src/proxy/proxy.ts:145](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L145)

Determines if the application is using the app router based on the locale header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res` | `NextResponse` | response |

#### Returns

`boolean`

true if app router is used

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`isAppRouter`](ProxyBase.md#isapprouter)

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:154](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L154)

Determines if the request is a Next.js (next/link) prefetch request

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is prefetch

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`isPrefetch`](ProxyBase.md#isprefetch)

***

### isPreview()

> `protected` **isPreview**(`req`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:133](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L133)

Determines if mode is preview

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is preview

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`isPreview`](ProxyBase.md#ispreview)

***

### personalize()

> `protected` **personalize**(`__namedParameters`): `Promise`\<\{ `variantId`: `string`; \}\>

Defined in: [nextjs/src/proxy/personalize-proxy.ts:354](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/personalize-proxy.ts#L354)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `friendlyId`: `string`; `geo?`: [`PersonalizeGeoData`](../../index/type-aliases/PersonalizeGeoData.md); `language`: `string`; `params`: `ExperienceParams`; `timeout?`: `number`; `variantIds?`: `string`[]; \} |
| `__namedParameters.friendlyId` | `string` |
| `__namedParameters.geo?` | [`PersonalizeGeoData`](../../index/type-aliases/PersonalizeGeoData.md) |
| `__namedParameters.language` | `string` |
| `__namedParameters.params` | `ExperienceParams` |
| `__namedParameters.timeout?` | `number` |
| `__namedParameters.variantIds?` | `string`[] |

#### Returns

`Promise`\<\{ `variantId`: `string`; \}\>

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/proxy/proxy.ts:271](https://github.com/Sitecore/content-sdk/blob/0741bb452b2ea3f885223f053dfeee4bf32d3e9e/packages/nextjs/src/proxy/proxy.ts#L271)

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

[`ProxyBase`](ProxyBase.md).[`rewrite`](ProxyBase.md#rewrite)
