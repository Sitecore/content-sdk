[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / MultisiteProxy

# Class: MultisiteProxy

Defined in: [nextjs/src/proxy/multisite-proxy.ts:48](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L48)

Proxy / handler for multisite support

## Extends

- [`ProxyBase`](ProxyBase.md)

## Extended by

- [`AppRouterMultisiteProxy`](AppRouterMultisiteProxy.md)

## Constructors

### Constructor

> **new MultisiteProxy**(`config?`): `MultisiteProxy`

Defined in: [nextjs/src/proxy/multisite-proxy.ts:52](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L52)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`MultisiteProxyConfig`](../type-aliases/MultisiteProxyConfig.md) | Multisite proxy config |

#### Returns

`MultisiteProxy`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`constructor`](ProxyBase.md#constructor)

## Properties

### config

> `protected` **config**: [`MultisiteProxyConfig`](../type-aliases/MultisiteProxyConfig.md)

Defined in: [nextjs/src/proxy/multisite-proxy.ts:52](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L52)

Multisite proxy config

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`config`](ProxyBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:81](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L81)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`defaultHostname`](ProxyBase.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/proxy/proxy.ts:82](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L82)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`siteResolver`](ProxyBase.md#siteresolver)

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [nextjs/src/proxy/multisite-proxy.ts:59](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L59)

Name of the proxy, used as a key in the context to store information about executed proxies

##### Returns

`string`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`name`](ProxyBase.md#name)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `boolean` \| `undefined`

Defined in: [nextjs/src/proxy/multisite-proxy.ts:177](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L177)

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

Defined in: [nextjs/src/proxy/proxy.ts:159](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L159)

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

Defined in: [nextjs/src/proxy/proxy.ts:229](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L229)

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

Defined in: [nextjs/src/proxy/proxy.ts:195](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L195)

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

Defined in: [nextjs/src/proxy/proxy.ts:171](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L171)

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

Defined in: [nextjs/src/proxy/proxy.ts:187](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L187)

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

Defined in: [nextjs/src/proxy/proxy.ts:209](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L209)

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

### getSiteRewrite()

> `protected` **getSiteRewrite**(`pathname`, `siteName`): `string`

Defined in: [nextjs/src/proxy/multisite-proxy.ts:206](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L206)

Generates a site-specific rewrite path based on the provided pathname and site name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pathname` | `string` | The pathname to be rewritten. |
| `siteName` | `string` | The name of the site. |

#### Returns

`string`

The rewritten path as a string.

***

### handle()

> **handle**(`req`, `res`, `proxiesContext?`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/multisite-proxy.ts:63](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L63)

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

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:114](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L114)

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

Defined in: [nextjs/src/proxy/proxy.ts:123](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L123)

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

Defined in: [nextjs/src/proxy/proxy.ts:102](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L102)

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

Defined in: [nextjs/src/proxy/proxy.ts:240](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/proxy.ts#L240)

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

### shouldSkipWhenDisabled()

> `protected` **shouldSkipWhenDisabled**(): `boolean`

Defined in: [nextjs/src/proxy/multisite-proxy.ts:196](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L196)

Determines if proxy should be skipped when multisite is disabled.
Override in subclasses to provide router-specific behavior.

#### Returns

`boolean`

true if proxy should be skipped when disabled

***

### shouldWarnWhenDisabled()

> `protected` **shouldWarnWhenDisabled**(`_res`): `void`

Defined in: [nextjs/src/proxy/multisite-proxy.ts:187](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/nextjs/src/proxy/multisite-proxy.ts#L187)

Called when multisite is disabled. Override this method in subclasses to show router-specific warnings.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_res` | `NextResponse` | response |

#### Returns

`void`
