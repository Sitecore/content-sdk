[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / AppRouterMultisiteProxy

# Class: AppRouterMultisiteProxy

Defined in: [nextjs/src/proxy/app-router-multisite-proxy.ts:8](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/app-router-multisite-proxy.ts#L8)

Proxy/handler for enabling multisite support in the Next.js App Router.

## Extends

- [`MultisiteProxy`](MultisiteProxy.md)

## Constructors

### Constructor

> **new AppRouterMultisiteProxy**(`config?`): `AppRouterMultisiteProxy`

Defined in: [nextjs/src/proxy/multisite-proxy.ts:39](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/multisite-proxy.ts#L39)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`MultisiteProxyConfig`](../type-aliases/MultisiteProxyConfig.md) | Multisite proxy config |

#### Returns

`AppRouterMultisiteProxy`

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`constructor`](MultisiteProxy.md#constructor)

## Properties

### config

> `protected` **config**: [`MultisiteProxyConfig`](../type-aliases/MultisiteProxyConfig.md)

Defined in: [nextjs/src/proxy/multisite-proxy.ts:39](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/multisite-proxy.ts#L39)

Multisite proxy config

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`config`](MultisiteProxy.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:95](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L95)

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`defaultHostname`](MultisiteProxy.md#defaulthostname)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/proxy/proxy.ts:96](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L96)

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`siteResolver`](MultisiteProxy.md#siteresolver)

## Methods

### disabled()

> `protected` **disabled**(`req`, `res`): `boolean` \| `undefined`

Defined in: [nextjs/src/proxy/multisite-proxy.ts:136](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/multisite-proxy.ts#L136)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`boolean` \| `undefined`

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`disabled`](MultisiteProxy.md#disabled)

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:166](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L166)

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

[`MultisiteProxy`](MultisiteProxy.md).[`extractDebugHeaders`](MultisiteProxy.md#extractdebugheaders)

***

### getClientFactory()

> `protected` **getClientFactory**(`graphQLOptions`): [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [nextjs/src/proxy/proxy.ts:236](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L236)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`getClientFactory`](MultisiteProxy.md#getclientfactory)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:202](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L202)

Extract 'host' header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`string`

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`getHostHeader`](MultisiteProxy.md#gethostheader)

***

### getLanguage()

> `protected` **getLanguage**(`req`, `res?`): `string`

Defined in: [nextjs/src/proxy/proxy.ts:178](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L178)

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

[`MultisiteProxy`](MultisiteProxy.md).[`getLanguage`](MultisiteProxy.md#getlanguage)

***

### getLanguageFromHeader()

> `protected` **getLanguageFromHeader**(`res?`): `string` \| `undefined`

Defined in: [nextjs/src/proxy/proxy.ts:194](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L194)

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

[`MultisiteProxy`](MultisiteProxy.md).[`getLanguageFromHeader`](MultisiteProxy.md#getlanguagefromheader)

***

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/proxy/proxy.ts:216](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L216)

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

[`MultisiteProxy`](MultisiteProxy.md).[`getSite`](MultisiteProxy.md#getsite)

***

### getSiteRewrite()

> `protected` **getSiteRewrite**(`pathname`, `siteName`): `string`

Defined in: [nextjs/src/proxy/app-router-multisite-proxy.ts:39](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/app-router-multisite-proxy.ts#L39)

Generates a site-specific rewrite path for app router based on the provided pathname and site name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pathname` | `string` | The pathname to be rewritten. |
| `siteName` | `string` | The name of the site. |

#### Returns

`string`

The rewritten path as a string.

#### Overrides

[`MultisiteProxy`](MultisiteProxy.md).[`getSiteRewrite`](MultisiteProxy.md#getsiterewrite)

***

### handle()

> **handle**(`req`, `res`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/multisite-proxy.ts:43](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/multisite-proxy.ts#L43)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`handle`](MultisiteProxy.md#handle)

***

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:121](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L121)

Determines if the application is using the app router based on the locale header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res` | `NextResponse` | response |

#### Returns

`boolean`

true if app router is used

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`isAppRouter`](MultisiteProxy.md#isapprouter)

***

### isPrefetch()

> `protected` **isPrefetch**(`req`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:130](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L130)

Determines if the request is a Next.js (next/link) prefetch request

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is prefetch

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`isPrefetch`](MultisiteProxy.md#isprefetch)

***

### isPreview()

> `protected` **isPreview**(`req`): `boolean`

Defined in: [nextjs/src/proxy/proxy.ts:109](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L109)

Determines if mode is preview

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |

#### Returns

`boolean`

is preview

#### Inherited from

[`MultisiteProxy`](MultisiteProxy.md).[`isPreview`](MultisiteProxy.md#ispreview)

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/proxy/proxy.ts:247](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L247)

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

[`MultisiteProxy`](MultisiteProxy.md).[`rewrite`](MultisiteProxy.md#rewrite)

***

### shouldSkipWhenDisabled()

> `protected` **shouldSkipWhenDisabled**(): `boolean`

Defined in: [nextjs/src/proxy/app-router-multisite-proxy.ts:29](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/app-router-multisite-proxy.ts#L29)

In App Router, we cannot skip the proxy even if enabled is false,
because the route structure requires the [site] segment.

#### Returns

`boolean`

always returns false (never skip) for App Router

#### Overrides

[`MultisiteProxy`](MultisiteProxy.md).[`shouldSkipWhenDisabled`](MultisiteProxy.md#shouldskipwhendisabled)

***

### shouldWarnWhenDisabled()

> `protected` **shouldWarnWhenDisabled**(`_res`): `void`

Defined in: [nextjs/src/proxy/app-router-multisite-proxy.ts:15](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/app-router-multisite-proxy.ts#L15)

Warns when multisite is disabled in App Router.
The proxy will still run to prevent routing errors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_res` | `NextResponse` | response (unused, kept for method signature compatibility) |

#### Returns

`void`

#### Overrides

[`MultisiteProxy`](MultisiteProxy.md).[`shouldWarnWhenDisabled`](MultisiteProxy.md#shouldwarnwhendisabled)
