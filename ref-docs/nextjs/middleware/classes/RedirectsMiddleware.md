[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RedirectsMiddleware

# Class: RedirectsMiddleware

Defined in: [nextjs/src/middleware/redirects-middleware.ts:41](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/redirects-middleware.ts#L41)

Middleware / handler fetches all redirects from Sitecore instance by grapqhl service
compares with current url and redirects to target url

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new RedirectsMiddleware**(`config?`): `RedirectsMiddleware`

Defined in: [nextjs/src/middleware/redirects-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/redirects-middleware.ts#L48)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`RedirectsMiddlewareConfig`](../type-aliases/RedirectsMiddlewareConfig.md) | redirects middleware config |

#### Returns

`RedirectsMiddleware`

#### Overrides

[`MiddlewareBase`](MiddlewareBase.md).[`constructor`](MiddlewareBase.md#constructor)

## Properties

### config

> `protected` **config**: [`RedirectsMiddlewareConfig`](../type-aliases/RedirectsMiddlewareConfig.md)

Defined in: [nextjs/src/middleware/redirects-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/redirects-middleware.ts#L48)

redirects middleware config

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`config`](MiddlewareBase.md#config)

***

### defaultHostname

> `protected` **defaultHostname**: `string`

Defined in: [nextjs/src/middleware/middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L53)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`defaultHostname`](MiddlewareBase.md#defaulthostname)

***

### redirectsService

> `protected` **redirectsService**: [`RedirectsService`](../../index/classes/RedirectsService.md)

Defined in: [nextjs/src/middleware/redirects-middleware.ts:42](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/redirects-middleware.ts#L42)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: [nextjs/src/middleware/middleware.ts:54](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L54)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`siteResolver`](MiddlewareBase.md#siteresolver)

## Methods

### createRedirectResponse()

> `protected` **createRedirectResponse**(`url`, `res`, `status`, `statusText`): `NextResponse`

Defined in: [nextjs/src/middleware/redirects-middleware.ts:383](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/redirects-middleware.ts#L383)

Helper function to create a redirect response and remove the x-middleware-next header.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `NextURL` | The URL to redirect to. |
| `res` | `undefined` \| `Response` | The response object. |
| `status` | `number` | The HTTP status code of the redirect. |
| `statusText` | `string` | The status text of the redirect. |

#### Returns

`NextResponse`

The redirect response.

***

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:107](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |
| `res` | `NextResponse` |

#### Returns

`undefined` \| `boolean`

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`disabled`](MiddlewareBase.md#disabled)

***

### dispatchRedirect()

> `protected` **dispatchRedirect**(`target`, `type`, `req`, `res`, `isExternal`): `NextResponse`

Defined in: [nextjs/src/middleware/redirects-middleware.ts:350](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/redirects-middleware.ts#L350)

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

Defined in: [nextjs/src/middleware/middleware.ts:124](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L124)

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

Defined in: [nextjs/src/middleware/middleware.ts:192](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L192)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `graphQLOptions` | `GraphQLClientOptions` |

#### Returns

[`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

[`MiddlewareBase`](MiddlewareBase.md).[`getClientFactory`](MiddlewareBase.md#getclientfactory)

***

### getHostHeader()

> `protected` **getHostHeader**(`req`): `undefined` \| `string`

Defined in: [nextjs/src/middleware/middleware.ts:160](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L160)

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

Defined in: [nextjs/src/middleware/middleware.ts:136](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L136)

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

Defined in: [nextjs/src/middleware/middleware.ts:152](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L152)

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

### getSite()

> `protected` **getSite**(`req`, `res?`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/middleware/middleware.ts:172](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L172)

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

Defined in: [nextjs/src/middleware/redirects-middleware.ts:71](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/redirects-middleware.ts#L71)

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

### isAppRouter()

> `protected` **isAppRouter**(`res`): `boolean`

Defined in: [nextjs/src/middleware/middleware.ts:79](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L79)

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

Defined in: [nextjs/src/middleware/middleware.ts:88](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L88)

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

Defined in: [nextjs/src/middleware/middleware.ts:67](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L67)

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

### normalizeUrl()

> `protected` **normalizeUrl**(`url`): `NextURL`

Defined in: [nextjs/src/middleware/redirects-middleware.ts:301](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/redirects-middleware.ts#L301)

When a user clicks on a link generated by the Link component from next/link,
Next.js adds special parameters in the route called path.
This method removes these special parameters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `NextURL` |  |

#### Returns

`NextURL`

normalize url

***

### rewrite()

> `protected` **rewrite**(`rewritePath`, `req`, `res`, `skipHeader?`): `NextResponse`

Defined in: [nextjs/src/middleware/middleware.ts:203](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/middleware/middleware.ts#L203)

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
