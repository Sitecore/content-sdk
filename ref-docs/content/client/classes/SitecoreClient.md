[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [content/src/client/sitecore-client.ts:270](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L270)

This is a generic content client that can be used by any framework.
Use it to retrieve pages, preview data, dictionary and other data

## Implements

- `BaseSitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreClient`

Defined in: [content/src/client/sitecore-client.ts:284](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L284)

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

Defined in: [content/src/client/sitecore-client.ts:274](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L274)

***

### componentService

> `protected` **componentService**: [`ComponentLayoutService`](../../editing/classes/ComponentLayoutService.md)

Defined in: [content/src/client/sitecore-client.ts:276](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L276)

***

### dictionaryService

> `protected` **dictionaryService**: [`DictionaryService`](../../i18n/classes/DictionaryService.md)

Defined in: [content/src/client/sitecore-client.ts:272](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L272)

***

### editingService

> `protected` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

Defined in: [content/src/client/sitecore-client.ts:273](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L273)

***

### errorPagesService

> `protected` **errorPagesService**: [`ErrorPagesService`](../../site/classes/ErrorPagesService.md)

Defined in: [content/src/client/sitecore-client.ts:275](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L275)

***

### graphQLClient

> `protected` **graphQLClient**: [`GraphQLClient`](../interfaces/GraphQLClient.md)

Defined in: [content/src/client/sitecore-client.ts:278](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L278)

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [content/src/client/sitecore-client.ts:284](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L284)

initOptions for the client, containing site and Sitecore connection details

***

### layoutService

> `protected` **layoutService**: [`LayoutService`](../../layout/classes/LayoutService.md)

Defined in: [content/src/client/sitecore-client.ts:271](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L271)

***

### sitePathService

> `protected` **sitePathService**: [`SitePathService`](../../site/classes/SitePathService.md)

Defined in: [content/src/client/sitecore-client.ts:277](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L277)

## Methods

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: [content/src/client/sitecore-client.ts:690](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L690)

#### Returns

`BaseServiceOptions`

***

### getData()

> **getData**\<`T`\>(`query`, `variables?`, `fetchOptions?`): `Promise`\<`T`\>

Defined in: [content/src/client/sitecore-client.ts:326](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L326)

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

Defined in: [content/src/client/sitecore-client.ts:494](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L494)

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

Defined in: [content/src/client/sitecore-client.ts:417](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L417)

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

Defined in: [content/src/client/sitecore-client.ts:548](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L548)

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

Defined in: [content/src/client/sitecore-client.ts:432](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L432)

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

Defined in: [content/src/client/sitecore-client.ts:676](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L676)

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

Defined in: [content/src/client/sitecore-client.ts:389](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L389)

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

Defined in: [content/src/client/sitecore-client.ts:341](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L341)

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

Defined in: [content/src/client/sitecore-client.ts:596](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L596)

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

Defined in: [content/src/client/sitecore-client.ts:447](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L447)

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

Defined in: [content/src/client/sitecore-client.ts:665](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L665)

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

Defined in: [content/src/client/sitecore-client.ts:683](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L683)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`RobotsService`](../../site/classes/RobotsService.md)

***

### getSiteMap()

> **getSiteMap**(`reqOptions`, `fetchOptions?`): `Promise`\<`string`\>

Defined in: [content/src/client/sitecore-client.ts:611](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L611)

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

Defined in: [content/src/client/sitecore-client.ts:307](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L307)

Normalize path regardless of type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | string or string array path |

#### Returns

`string`

string path
