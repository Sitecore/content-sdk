[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / RedirectsProxy

# Class: RedirectsProxy

Defined in: [nextjs/src/proxy/redirects-proxy.ts:44](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L44)

Proxy / handler fetches all redirects from Sitecore instance by grapqhl service
compares with current url and redirects to target url

## Extends

- [`ProxyBase`](ProxyBase.md)

## Constructors

### Constructor

> **new RedirectsProxy**(`config?`): `RedirectsProxy`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:51](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L51)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`RedirectsProxyConfig`](../type-aliases/RedirectsProxyConfig.md) | redirects proxy config |

#### Returns

`RedirectsProxy`

#### Overrides

[`ProxyBase`](ProxyBase.md).[`constructor`](ProxyBase.md#constructor)

## Properties

### config

> `protected` **config**: [`RedirectsProxyConfig`](../type-aliases/RedirectsProxyConfig.md)

Defined in: [nextjs/src/proxy/redirects-proxy.ts:51](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L51)

redirects proxy config

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`config`](ProxyBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/proxy/proxy.ts:95](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L95)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`defaultHostname`](ProxyBase.md#defaulthostname)

***

### redirectsService

> `protected` **redirectsService**: [`RedirectsService`](../../index/classes/RedirectsService.md) \| `null`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:45](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L45)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/proxy/proxy.ts:96](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L96)

#### Inherited from

[`ProxyBase`](ProxyBase.md).[`siteResolver`](ProxyBase.md#siteresolver)

## Methods

### createRedirectResponse()

> `protected` **createRedirectResponse**(`url`, `res`, `status`, `statusText`): `NextResponse`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:556](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L556)

Helper function to create a redirect response and remove the x-proxy-next header.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `NextURL` | The URL to redirect to. |
| `res` | `Response` \| `undefined` | The response object. |
| `status` | `number` | The HTTP status code of the redirect. |
| `statusText` | `string` | The status text of the redirect. |

#### Returns

`NextResponse`

The redirect response.

***

### disabled()

> `protected` **disabled**(`req`, `res`): `boolean` \| `undefined`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:276](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L276)

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

### dispatchRedirect()

> `protected` **dispatchRedirect**(`target`, `type`, `req`, `res`, `isExternal?`): `NextResponse`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:492](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L492)

Helper function to dispatch a redirect or rewrite based on the redirect type.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `target` | `string` \| `NextURL` | `undefined` | The final target to redirect/rewrite to. |
| `type` | `string` | `undefined` | One of `REDIRECT_TYPE_301`, `REDIRECT_TYPE_302`, or `REDIRECT_TYPE_SERVER_TRANSFER`. |
| `req` | `NextRequest` | `undefined` | The incoming request. |
| `res` | `NextResponse` | `undefined` | The current response (used for header cleanup / carry-over). |
| `isExternal` | `boolean` | `false` | Set to `true` when `target` is an external absolute URL (e.g. `https://…`). Passed through to `rewrite` so it can skip locale/basePath stripping for externals. |

#### Returns

`NextResponse`

The redirect/rewrite response, or `res` if the type is not recognized.

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:166](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L166)

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

Defined in: [nextjs/src/proxy/proxy.ts:236](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L236)

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

Defined in: [nextjs/src/proxy/proxy.ts:202](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L202)

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

Defined in: [nextjs/src/proxy/proxy.ts:178](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L178)

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

Defined in: [nextjs/src/proxy/proxy.ts:194](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L194)

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

Defined in: [nextjs/src/proxy/proxy.ts:216](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L216)

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

Defined in: [nextjs/src/proxy/redirects-proxy.ts:102](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L102)

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

Defined in: [nextjs/src/proxy/proxy.ts:121](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L121)

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

Defined in: [nextjs/src/proxy/proxy.ts:130](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L130)

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

Defined in: [nextjs/src/proxy/proxy.ts:109](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L109)

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

### normalizeUrl()

> `protected` **normalizeUrl**(`url`): `NextURL`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:437](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/redirects-proxy.ts#L437)

When a user clicks on a link generated by the Link component from next/link,
Next.js adds special parameters in the route called path.
This method removes these special parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `NextURL` | - |

#### Returns

`NextURL`

normalize url

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/proxy/proxy.ts:247](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/nextjs/src/proxy/proxy.ts#L247)

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
