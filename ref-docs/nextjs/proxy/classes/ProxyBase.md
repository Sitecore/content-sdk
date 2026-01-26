[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyBase

# Abstract Class: ProxyBase

Defined in: [nextjs/src/proxy/proxy.ts:57](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L57)

Base proxy class with common methods

## Extends

- [`ProxyHandler`](ProxyHandler.md)

## Extended by

- [`RedirectsProxy`](RedirectsProxy.md)
- [`PersonalizeProxy`](PersonalizeProxy.md)
- [`MultisiteProxy`](MultisiteProxy.md)
- [`LocaleProxy`](LocaleProxy.md)

## Constructors

### Constructor

> **new ProxyBase**(`config`): `ProxyBase`

Defined in: [nextjs/src/proxy/proxy.ts:61](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L61)

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

Defined in: [nextjs/src/proxy/proxy.ts:61](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L61)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:58](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L58)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/proxy/proxy.ts:59](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L59)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `boolean` \| `undefined`

Defined in: [nextjs/src/proxy/proxy.ts:112](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L112)

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

Defined in: [nextjs/src/proxy/proxy.ts:129](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L129)

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

Defined in: [nextjs/src/proxy/proxy.ts:197](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L197)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `string` \| `undefined`

Defined in: [nextjs/src/proxy/proxy.ts:165](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L165)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`string` \| `undefined`

***

### getLanguage()

> `protected` **getLanguage**(`req`, `res?`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:141](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L141)

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

Defined in: [nextjs/src/proxy/proxy.ts:157](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L157)

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

Defined in: [nextjs/src/proxy/proxy.ts:177](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L177)

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

> `abstract` **handle**(`req`, `res`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/proxy.ts:50](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L50)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Inherited from

[`ProxyHandler`](ProxyHandler.md).[`handle`](ProxyHandler.md#handle)

***

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:84](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L84)

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

Defined in: [nextjs/src/proxy/proxy.ts:93](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L93)

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

Defined in: [nextjs/src/proxy/proxy.ts:72](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L72)

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

Defined in: [nextjs/src/proxy/proxy.ts:208](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/nextjs/src/proxy/proxy.ts#L208)

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
