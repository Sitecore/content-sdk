[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [content/src/client/sitecore-client.ts:280](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L280)

This is a generic content client that can be used by any framework.
Use it to retrieve pages, preview data, dictionary and other data

## Implements

- `BaseSitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreClient`

Defined in: [content/src/client/sitecore-client.ts:294](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L294)

Init SitecoreClient

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `initOptions` | [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md) | initOptions for the client, containing site and Sitecore connection details |

#### Returns

`SitecoreClient`

## Properties

### clientFactory

> `protected` **clientFactory**: [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

Defined in: [content/src/client/sitecore-client.ts:284](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L284)

***

### componentService

> `protected` **componentService**: [`ComponentLayoutService`](../../editing/classes/ComponentLayoutService.md)

Defined in: [content/src/client/sitecore-client.ts:286](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L286)

***

### dictionaryService

> `protected` **dictionaryService**: [`DictionaryService`](../../i18n/classes/DictionaryService.md)

Defined in: [content/src/client/sitecore-client.ts:282](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L282)

***

### editingService

> `protected` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

Defined in: [content/src/client/sitecore-client.ts:283](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L283)

***

### errorPagesService

> `protected` **errorPagesService**: [`ErrorPagesService`](../../site/classes/ErrorPagesService.md)

Defined in: [content/src/client/sitecore-client.ts:285](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L285)

***

### graphQLClient

> `protected` **graphQLClient**: [`GraphQLClient`](../interfaces/GraphQLClient.md)

Defined in: [content/src/client/sitecore-client.ts:288](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L288)

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [content/src/client/sitecore-client.ts:294](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L294)

initOptions for the client, containing site and Sitecore connection details

***

### layoutService

> `protected` **layoutService**: [`LayoutService`](../../layout/classes/LayoutService.md)

Defined in: [content/src/client/sitecore-client.ts:281](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L281)

***

### sitePathService

> `protected` **sitePathService**: [`SitePathService`](../../site/classes/SitePathService.md)

Defined in: [content/src/client/sitecore-client.ts:287](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L287)

## Methods

### applyContentRewrite()

> `protected` **applyContentRewrite**(`layout`): [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)

Defined in: [content/src/client/sitecore-client.ts:736](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L736)

**`Internal`**

Applies media URL rewrite when rewriteMediaUrls is enabled.
When true, uses default Edge host rewriter; when a function, transforms each string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layout` | [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md) | Layout data from layout/editing/component/error service |

#### Returns

[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)

Rewritten layout (or same reference if rewrite disabled)

***

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: [content/src/client/sitecore-client.ts:715](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L715)

#### Returns

`BaseServiceOptions`

***

### getData()

> **getData**\<`T`\>(`query`, `variables?`, `fetchOptions?`): `Promise`\<`T`\>

Defined in: [content/src/client/sitecore-client.ts:336](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L336)

Execute a raw GraphQL request using the client's configured GraphQL Edge endpoint.
This is a thin pass-through to the underlying `GraphQLClient.request` method,

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `string` \| `DocumentNode` | GraphQL query |
| `variables?` | `Record`\<`string`, `unknown`\> | Optional variables bag |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Optional fetch overrides (e.g. fetch, headers) |

#### Returns

`Promise`\<`T`\>

#### Implementation of

`BaseSitecoreClient.getData`

***

### getDesignLibraryData()

> **getDesignLibraryData**(`designLibData`, `fetchOptions?`): `Promise`\<[`Page`](../type-aliases/Page.md)\>

Defined in: [content/src/client/sitecore-client.ts:514](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L514)

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

Defined in: [content/src/client/sitecore-client.ts:428](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L428)

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

> **getErrorPage**(`code`, `pageOptions?`, `fetchOptions?`): `Promise`\<[`Page`](../type-aliases/Page.md) \| `null`\>

Defined in: [content/src/client/sitecore-client.ts:569](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L569)

Get error page details for a given error code

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | [`ErrorPage`](../enumerations/ErrorPage.md) | The error code to get the error page for |
| `pageOptions?` | `Partial`\<[`RouteOptions`](../../layout/type-aliases/RouteOptions.md)\> | The page options to get the error page for |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`Page`](../type-aliases/Page.md) \| `null`\>

A promise that resolves to the error page details or null if not found

#### Implementation of

`BaseSitecoreClient.getErrorPage`

***

### getErrorPages()

> **getErrorPages**(`routeOptions?`, `fetchOptions?`): `Promise`\<[`ErrorPages`](../../site/type-aliases/ErrorPages.md) \| `null`\>

Defined in: [content/src/client/sitecore-client.ts:443](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L443)

Retrieves error pages for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions?` | [`RouteOptions`](../../layout/type-aliases/RouteOptions.md) | Route options containing language and site name to load error pages |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`ErrorPages`](../../site/type-aliases/ErrorPages.md) \| `null`\>

A promise that resolves to the error pages or null if not found.

#### Implementation of

`BaseSitecoreClient.getErrorPages`

***

### getGraphqlSitemapXMLService()

> `protected` **getGraphqlSitemapXMLService**(`siteName`): [`SitemapXmlService`](../../site/classes/SitemapXmlService.md)

Defined in: [content/src/client/sitecore-client.ts:701](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L701)

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

Defined in: [content/src/client/sitecore-client.ts:398](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L398)

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

> **getPage**(`path`, `pageOptions?`, `fetchOptions?`): `Promise`\<[`Page`](../type-aliases/Page.md) \| `null`\>

Defined in: [content/src/client/sitecore-client.ts:351](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L351)

Get page details for a route, with layout and other details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | route path |
| `pageOptions?` | [`PageOptions`](../type-aliases/PageOptions.md) | site, language and personalization variant details for route |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`Page`](../type-aliases/Page.md) \| `null`\>

page details

#### Implementation of

`BaseSitecoreClient.getPage`

***

### getPagePaths()

> **getPagePaths**(`sites`, `languages?`, `fetchOptions?`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: [content/src/client/sitecore-client.ts:619](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L619)

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

> **getPreview**(`previewData`, `fetchOptions?`): `Promise`\<[`Page`](../type-aliases/Page.md) \| `null`\>

Defined in: [content/src/client/sitecore-client.ts:458](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L458)

Retrieves preview page and layout details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `previewData` | [`EditingPreviewData`](../../editing/type-aliases/EditingPreviewData.md) \| `undefined` | The editing preview data for metadata mode. |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`Page`](../type-aliases/Page.md) \| `null`\>

preview page details

#### Implementation of

`BaseSitecoreClient.getPreview`

***

### getRobots()

> **getRobots**(`siteName`, `fetchOptions?`): `Promise`\<`string` \| `null`\>

Defined in: [content/src/client/sitecore-client.ts:690](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L690)

Retrieves the robots.txt content for a given site name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | The name of the site to retrieve the robots.txt for. |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Optional fetch options. |

#### Returns

`Promise`\<`string` \| `null`\>

A promise that resolves to the robots.txt content,
or null if no content is found.

#### Implementation of

`BaseSitecoreClient.getRobots`

***

### getRobotsService()

> `protected` **getRobotsService**(`siteName`): [`RobotsService`](../../site/classes/RobotsService.md)

Defined in: [content/src/client/sitecore-client.ts:708](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L708)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`RobotsService`](../../site/classes/RobotsService.md)

***

### getSiteMap()

> **getSiteMap**(`reqOptions`, `fetchOptions?`): `Promise`\<`string`\>

Defined in: [content/src/client/sitecore-client.ts:634](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L634)

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

Defined in: [content/src/client/sitecore-client.ts:317](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/content/src/client/sitecore-client.ts#L317)

Normalize path regardless of type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | string or string array path |

#### Returns

`string`

string path
