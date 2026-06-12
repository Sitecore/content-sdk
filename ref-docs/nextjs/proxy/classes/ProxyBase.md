[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyBase

# Abstract Class: ProxyBase

Defined in: [nextjs/src/proxy/proxy.ts:105](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L105)

Base proxy class with common methods

## Extends

- [`ProxyHandler`](ProxyHandler.md)

## Extended by

- [`RedirectsProxy`](RedirectsProxy.md)
- [`PersonalizeProxy`](PersonalizeProxy.md)
- [`MultisiteProxy`](MultisiteProxy.md)
- [`LocaleProxy`](LocaleProxy.md)
- [`BotTrackingProxy`](BotTrackingProxy.md)
- [`PreviewProxy`](PreviewProxy.md)

## Constructors

### Constructor

> **new ProxyBase**(`config`): `ProxyBase`

Defined in: [nextjs/src/proxy/proxy.ts:109](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L109)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ProxyBaseConfig`](../type-aliases/ProxyBaseConfig.md) |

#### Returns

`ProxyBase`

#### Overrides

[`ProxyHandler`](ProxyHandler.md).[`constructor`](ProxyHandler.md#constructor)

## Properties

### config

> `protected` **config**: [`ProxyBaseConfig`](../type-aliases/ProxyBaseConfig.md)

Defined in: [nextjs/src/proxy/proxy.ts:109](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L109)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:106](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L106)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/proxy/proxy.ts:107](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L107)

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [nextjs/src/proxy/proxy.ts:118](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L118)

Name of the proxy, used as a key in the context to store information about executed proxies

##### Returns

`string`

#### Overrides

[`ProxyHandler`](ProxyHandler.md).[`name`](ProxyHandler.md#name)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `boolean` \| `undefined`

Defined in: [nextjs/src/proxy/proxy.ts:167](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L167)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`boolean` \| `undefined`

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:184](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L184)

Safely extract all headers for debug logging
Necessary to avoid proxy issue https://github.com/vercel/next.js/issues/39765

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

Defined in: [nextjs/src/proxy/proxy.ts:254](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L254)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:220](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L220)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`string`

***

### getLanguage()

> `protected` **getLanguage**(`req`, `res?`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:196](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L196)

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

> `protected` **getLanguageFromHeader**(`res?`): `string` \| `undefined`

Defined in: [nextjs/src/proxy/proxy.ts:212](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L212)

Extract language from locale header of the response
set by LocaleProxy for app router application

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`string` \| `undefined`

language or undefined if not found

***

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/proxy/proxy.ts:234](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L234)

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

> `abstract` **handle**(`req`, `res`, `proxiesContext?`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/proxy.ts:58](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L58)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `proxiesContext?` | [`ProxiesContext`](../type-aliases/ProxiesContext.md) | context to share information between proxies |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Inherited from

[`ProxyHandler`](ProxyHandler.md).[`handle`](ProxyHandler.md#handle)

***

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:139](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L139)

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

Defined in: [nextjs/src/proxy/proxy.ts:148](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L148)

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

Defined in: [nextjs/src/proxy/proxy.ts:127](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L127)

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

Defined in: [nextjs/src/proxy/proxy.ts:265](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/nextjs/src/proxy/proxy.ts#L265)

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
