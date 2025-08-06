[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RedirectsMiddleware

# Class: RedirectsMiddleware

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/redirects-middleware.ts:41](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/redirects-middleware.ts#L41)
=======
Defined in: [nextjs/src/middleware/redirects-middleware.ts:41](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/redirects-middleware.ts#L41)
>>>>>>> dd686bb50 (Update API docs)

Middleware / handler fetches all redirects from Sitecore instance by grapqhl service
compares with current url and redirects to target url

## Extends

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new RedirectsMiddleware**(`config?`): `RedirectsMiddleware`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/redirects-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/redirects-middleware.ts#L48)
=======
Defined in: [nextjs/src/middleware/redirects-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/redirects-middleware.ts#L48)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/redirects-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/redirects-middleware.ts#L48)
=======
Defined in: [nextjs/src/middleware/redirects-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/redirects-middleware.ts#L48)
>>>>>>> dd686bb50 (Update API docs)

redirects middleware config

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

### redirectsService

> `protected` **redirectsService**: [`RedirectsService`](../../index/classes/RedirectsService.md)

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/redirects-middleware.ts:42](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/redirects-middleware.ts#L42)
=======
Defined in: [nextjs/src/middleware/redirects-middleware.ts:42](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/redirects-middleware.ts#L42)
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

### createRedirectResponse()

> `protected` **createRedirectResponse**(`url`, `res`, `status`, `statusText`): `NextResponse`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/redirects-middleware.ts:353](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/redirects-middleware.ts#L353)
=======
Defined in: [nextjs/src/middleware/redirects-middleware.ts:353](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/redirects-middleware.ts#L353)
>>>>>>> dd686bb50 (Update API docs)

Helper function to create a redirect response and remove the x-middleware-next header.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `NextURL` | The URL to redirect to. |
| `res` | `undefined` \| `Response` | The response object. |
| `status` | `number` | The HTTP status code of the redirect. |
| `statusText` | `string` | The status text of the redirect. |

#### Returns

`NextResponse`

The redirect response.

***

### disabled()

> `protected` **disabled**(`req`, `res`): `undefined` \| `boolean`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:95](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L95)
=======
Defined in: [nextjs/src/middleware/middleware.ts:95](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L95)
>>>>>>> dd686bb50 (Update API docs)

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
Defined in: [nextjs/src/middleware/redirects-middleware.ts:71](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/redirects-middleware.ts#L71)
=======
Defined in: [nextjs/src/middleware/redirects-middleware.ts:71](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/redirects-middleware.ts#L71)
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

### normalizeUrl()

> `protected` **normalizeUrl**(`url`): `NextURL`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/redirects-middleware.ts:306](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/redirects-middleware.ts#L306)
=======
Defined in: [nextjs/src/middleware/redirects-middleware.ts:306](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/redirects-middleware.ts#L306)
>>>>>>> dd686bb50 (Update API docs)

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
