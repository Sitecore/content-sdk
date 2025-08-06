[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:240](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L240)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:240](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L240)
>>>>>>> dd686bb50 (Update API docs)

This is a generic content client that can be used by any framework.
Use it to retrieve pages, preview data, dictionary and other data

## Implements

- `BaseSitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreClient`

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:253](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L253)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:253](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L253)
>>>>>>> dd686bb50 (Update API docs)

Init SitecoreClient

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `initOptions` | [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md) | initOptions for the client, containing site and Sitecore connection details |

#### Returns

`SitecoreClient`

## Properties

### clientFactory

> `protected` **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:244](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L244)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:244](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L244)
>>>>>>> dd686bb50 (Update API docs)

***

### componentService

> `protected` **componentService**: [`ComponentLayoutService`](../../editing/classes/ComponentLayoutService.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:246](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L246)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:246](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L246)
>>>>>>> dd686bb50 (Update API docs)

***

### dictionaryService

> `protected` **dictionaryService**: [`DictionaryService`](../../i18n/classes/DictionaryService.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:242](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L242)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:242](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L242)
>>>>>>> dd686bb50 (Update API docs)

***

### editingService

> `protected` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:243](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L243)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:243](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L243)
>>>>>>> dd686bb50 (Update API docs)

***

### errorPagesService

> `protected` **errorPagesService**: [`ErrorPagesService`](../../site/classes/ErrorPagesService.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:245](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L245)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:245](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L245)
>>>>>>> dd686bb50 (Update API docs)

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:253](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L253)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:253](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L253)
>>>>>>> dd686bb50 (Update API docs)

initOptions for the client, containing site and Sitecore connection details

***

### layoutService

> `protected` **layoutService**: [`LayoutService`](../../layout/classes/LayoutService.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:241](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L241)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:241](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L241)
>>>>>>> dd686bb50 (Update API docs)

***

### sitePathService

> `protected` **sitePathService**: [`SitePathService`](../../site/classes/SitePathService.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:247](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L247)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:247](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L247)
>>>>>>> dd686bb50 (Update API docs)

## Methods

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:640](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L640)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:640](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L640)
>>>>>>> dd686bb50 (Update API docs)

#### Returns

`BaseServiceOptions`

***

### getDesignLibraryData()

> **getDesignLibraryData**(`designLibData`, `fetchOptions?`): `Promise`\<[`Page`](../type-aliases/Page.md)\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:447](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L447)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:447](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L447)
>>>>>>> dd686bb50 (Update API docs)

Get design library page details for Design Library mode of your app

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `designLibData` | [`DesignLibraryRenderPreviewData`](../../editing/interfaces/DesignLibraryRenderPreviewData.md) | preview data set in 'library' mode of the app |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`Page`](../type-aliases/Page.md)\>

preview page for Design Library

***

### getDictionary()

> **getDictionary**(`routeOptions?`, `fetchOptions?`): `Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:366](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L366)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:366](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L366)
>>>>>>> dd686bb50 (Update API docs)

Retrieves dictionary phrases for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions?` | `Partial`\<[`RouteOptions`](../../layout/type-aliases/RouteOptions.md)\> | Route options containing language and site name to load dictionary for |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

A promise that resolves to the dictionary phrases.

#### Implementation of

`BaseSitecoreClient.getDictionary`

***

### getErrorPage()

> **getErrorPage**(`code`, `pageOptions?`, `fetchOptions?`): `Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:499](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L499)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:499](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L499)
>>>>>>> dd686bb50 (Update API docs)

Get error page details for a given error code

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | [`ErrorPage`](../enumerations/ErrorPage.md) | The error code to get the error page for |
| `pageOptions?` | `Partial`\<[`RouteOptions`](../../layout/type-aliases/RouteOptions.md)\> | The page options to get the error page for |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

A promise that resolves to the error page details or null if not found

#### Implementation of

`BaseSitecoreClient.getErrorPage`

***

### getErrorPages()

> **getErrorPages**(`routeOptions?`, `fetchOptions?`): `Promise`\<`null` \| [`ErrorPages`](../../site/type-aliases/ErrorPages.md)\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:381](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L381)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:381](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L381)
>>>>>>> dd686bb50 (Update API docs)

Retrieves error pages for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions?` | [`RouteOptions`](../../layout/type-aliases/RouteOptions.md) | Route options containing language and site name to load error pages |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<`null` \| [`ErrorPages`](../../site/type-aliases/ErrorPages.md)\>

A promise that resolves to the error pages or null if not found.

#### Implementation of

`BaseSitecoreClient.getErrorPages`

***

### getGraphqlSitemapXMLService()

> `protected` **getGraphqlSitemapXMLService**(`siteName`): [`SitemapXmlService`](../../site/classes/SitemapXmlService.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:626](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L626)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:626](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L626)
>>>>>>> dd686bb50 (Update API docs)

Factory methods for creating dependencies
Subclasses can override these to provide custom implementations.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`SitemapXmlService`](../../site/classes/SitemapXmlService.md)

***

### getHeadLinks()

> **getHeadLinks**(`layoutData`, `options?`): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:340](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L340)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:340](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L340)
>>>>>>> dd686bb50 (Update API docs)

Retrieves the head `<link>` elements for Sitecore styles and themes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md) | The layout data containing styles and themes. |
| `options?` | \{ `enableStyles?`: `boolean`; `enableThemes?`: `boolean`; \} | Optional configuration for enabling styles and themes. |
| `options.enableStyles?` | `boolean` | Whether to include content styles. |
| `options.enableThemes?` | `boolean` | Whether to include theme styles. |

#### Returns

[`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

An array of `<link>` elements for stylesheets.

#### Implementation of

`BaseSitecoreClient.getHeadLinks`

***

### getPage()

> **getPage**(`path`, `pageOptions?`, `fetchOptions?`): `Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:292](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L292)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:292](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L292)
>>>>>>> dd686bb50 (Update API docs)

Get page details for a route, with layout and other details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | route path |
| `pageOptions?` | [`PageOptions`](../type-aliases/PageOptions.md) | site, language and personalization variant details for route |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

page details

#### Implementation of

`BaseSitecoreClient.getPage`

***

### getPagePaths()

> **getPagePaths**(`sites`, `languages?`, `fetchOptions?`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:547](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L547)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:547](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L547)
>>>>>>> dd686bb50 (Update API docs)

Retrieves the static paths for pages based on the given languages.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | `string`[] | An array of site names to fetch routes for. |
| `languages?` | `string`[] | An optional array of language codes to generate paths for. |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch options. |

#### Returns

`Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

A promise that resolves to an array of static paths.

#### Implementation of

`BaseSitecoreClient.getPagePaths`

***

### getPreview()

> **getPreview**(`previewData`, `fetchOptions?`): `Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:396](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L396)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:396](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L396)
>>>>>>> dd686bb50 (Update API docs)

Retrieves preview page and layout details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `previewData` | `undefined` \| [`EditingPreviewData`](../../editing/type-aliases/EditingPreviewData.md) | The editing preview data for metadata mode. |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

preview page details

#### Implementation of

`BaseSitecoreClient.getPreview`

***

### getRobots()

> **getRobots**(`siteName`, `fetchOptions?`): `Promise`\<`null` \| `string`\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:615](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L615)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:615](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L615)
>>>>>>> dd686bb50 (Update API docs)

Retrieves the robots.txt content for a given site name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | The name of the site to retrieve the robots.txt for. |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Optional fetch options. |

#### Returns

`Promise`\<`null` \| `string`\>

A promise that resolves to the robots.txt content,
or null if no content is found.

#### Implementation of

`BaseSitecoreClient.getRobots`

***

### getRobotsService()

> `protected` **getRobotsService**(`siteName`): [`RobotsService`](../../site/classes/RobotsService.md)

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:633](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L633)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:633](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L633)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`RobotsService`](../../site/classes/RobotsService.md)

***

### getSiteMap()

> **getSiteMap**(`reqOptions`, `fetchOptions?`): `Promise`\<`string`\>

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:562](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L562)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:562](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L562)
>>>>>>> dd686bb50 (Update API docs)

Retrieves sitemap XML content - either a specific sitemap or the index of all sitemaps.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `reqOptions` | [`SitemapXmlOptions`](../type-aliases/SitemapXmlOptions.md) | Options for sitemap retrieval |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch options. |

#### Returns

`Promise`\<`string`\>

Promise resolving to the sitemap XML content as string

#### Throws

Throws 'REDIRECT_404' if requested sitemap is not found

#### Implementation of

`BaseSitecoreClient.getSiteMap`

***

### parsePath()

> **parsePath**(`path`): `string`

<<<<<<< HEAD
Defined in: [packages/core/src/client/sitecore-client.ts:273](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/client/sitecore-client.ts#L273)
=======
Defined in: [packages/core/src/client/sitecore-client.ts:273](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/client/sitecore-client.ts#L273)
>>>>>>> dd686bb50 (Update API docs)

Normalize path regardless of type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | string or string array path |

#### Returns

`string`

string path
