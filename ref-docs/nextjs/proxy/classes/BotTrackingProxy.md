[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / BotTrackingProxy

# Class: BotTrackingProxy

Defined in: [nextjs/src/proxy/bot-tracking-proxy.ts:31](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/bot-tracking-proxy.ts#L31)

Next.js proxy that runs bot detection once per request and sets the bot cookie.
Run first in the proxy chain to ensure that the bot cookie is set before other proxies run.

## Extends

- [`ProxyBase`](ProxyBase.md)

## Constructors

### Constructor

> **new BotTrackingProxy**(`config`): `BotTrackingProxy`

Defined in: [nextjs/src/proxy/bot-tracking-proxy.ts:32](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/bot-tracking-proxy.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`BotTrackingProxyConfig`](../type-aliases/BotTrackingProxyConfig.md) |

#### Returns

`BotTrackingProxy`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`constructor`](ProxyBase.md#constructor)

## Properties

### config

> `protected` **config**: [`BotTrackingProxyConfig`](../type-aliases/BotTrackingProxyConfig.md)

Defined in: [nextjs/src/proxy/bot-tracking-proxy.ts:32](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/bot-tracking-proxy.ts#L32)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`config`](ProxyBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:95](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L95)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`defaultHostname`](ProxyBase.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/proxy/proxy.ts:96](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L96)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`siteResolver`](ProxyBase.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `boolean` \| `undefined`

Defined in: [nextjs/src/proxy/proxy.ts:149](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L149)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`boolean` \| `undefined`

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`disabled`](ProxyBase.md#disabled)

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:166](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L166)

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

Defined in: [nextjs/src/proxy/proxy.ts:236](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L236)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`getClientFactory`](ProxyBase.md#getclientfactory)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:202](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L202)

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

Defined in: [nextjs/src/proxy/proxy.ts:178](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L178)

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

Defined in: [nextjs/src/proxy/proxy.ts:194](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L194)

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

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/proxy/proxy.ts:216](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L216)

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

> **handle**(`req`, `res`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/bot-tracking-proxy.ts:36](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/bot-tracking-proxy.ts#L36)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Overrides

[`ProxyBase`](ProxyBase.md).[`handle`](ProxyBase.md#handle)

***

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:121](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L121)

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

Defined in: [nextjs/src/proxy/proxy.ts:130](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L130)

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

Defined in: [nextjs/src/proxy/proxy.ts:109](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L109)

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

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/proxy/proxy.ts:247](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/proxy.ts#L247)

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

***

### shouldSkipForLocalEnvironment()

> `protected` **shouldSkipForLocalEnvironment**(`req`): `boolean`

Defined in: [nextjs/src/proxy/bot-tracking-proxy.ts:135](https://github.com/Sitecore/content-sdk/blob/ced58bb49648d0be99eb0979ab77edb76e1a6a33/packages/nextjs/src/proxy/bot-tracking-proxy.ts#L135)

**`Internal`**

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | Incoming request |

#### Returns

`boolean`

True when bot tracking should be skipped for a local / dev environment.
