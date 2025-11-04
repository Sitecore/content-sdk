[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [packages/core/src/client/sitecore-client.ts:255](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L255)

This is a generic content client that can be used by any framework.
Use it to retrieve pages, preview data, dictionary and other data

## Implements

- `BaseSitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreClient`

Defined in: [packages/core/src/client/sitecore-client.ts:269](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L269)

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

Defined in: [packages/core/src/client/sitecore-client.ts:259](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L259)

***

### componentService

> `protected` **componentService**: [`ComponentLayoutService`](../../editing/classes/ComponentLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:261](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L261)

***

### dictionaryService

> `protected` **dictionaryService**: [`DictionaryService`](../../i18n/classes/DictionaryService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:257](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L257)

***

### editingService

> `protected` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:258](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L258)

***

### errorPagesService

> `protected` **errorPagesService**: [`ErrorPagesService`](../../site/classes/ErrorPagesService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:260](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L260)

***

### graphQLClient

> `protected` **graphQLClient**: [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/client/sitecore-client.ts:263](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L263)

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [packages/core/src/client/sitecore-client.ts:269](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L269)

initOptions for the client, containing site and Sitecore connection details

***

### layoutService

> `protected` **layoutService**: [`LayoutService`](../../layout/classes/LayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:256](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L256)

***

### sitePathService

> `protected` **sitePathService**: [`SitePathService`](../../site/classes/SitePathService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:262](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L262)

## Methods

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: [packages/core/src/client/sitecore-client.ts:675](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L675)

#### Returns

`BaseServiceOptions`

***

### getData()

> **getData**\<`T`\>(`query`, `variables?`, `fetchOptions?`): `Promise`\<`T`\>

Defined in: [packages/core/src/client/sitecore-client.ts:311](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L311)

Execute a raw GraphQL request using the client's configured GraphQL Edge endpoint.
This is a thin pass-through to the underlying [GraphQLClient.request](../../index/interfaces/GraphQLClient.md#request),

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

Defined in: [packages/core/src/client/sitecore-client.ts:479](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L479)

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

Defined in: [packages/core/src/client/sitecore-client.ts:402](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L402)

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

Defined in: [packages/core/src/client/sitecore-client.ts:533](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L533)

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

Defined in: [packages/core/src/client/sitecore-client.ts:417](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L417)

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

Defined in: [packages/core/src/client/sitecore-client.ts:661](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L661)

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

Defined in: [packages/core/src/client/sitecore-client.ts:374](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L374)

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

Defined in: [packages/core/src/client/sitecore-client.ts:326](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L326)

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

Defined in: [packages/core/src/client/sitecore-client.ts:581](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L581)

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

Defined in: [packages/core/src/client/sitecore-client.ts:432](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L432)

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

Defined in: [packages/core/src/client/sitecore-client.ts:650](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L650)

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

Defined in: [packages/core/src/client/sitecore-client.ts:668](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L668)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`RobotsService`](../../site/classes/RobotsService.md)

***

### getSiteMap()

> **getSiteMap**(`reqOptions`, `fetchOptions?`): `Promise`\<`string`\>

Defined in: [packages/core/src/client/sitecore-client.ts:596](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L596)

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

Defined in: [packages/core/src/client/sitecore-client.ts:292](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/client/sitecore-client.ts#L292)

Normalize path regardless of type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | string or string array path |

#### Returns

`string`

string path
