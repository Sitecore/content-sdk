[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [content/src/client/sitecore-client.ts:299](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L299)

This is a generic content client that can be used by any framework.
Use it to retrieve pages, preview data, dictionary and other data

## Implements

- `BaseSitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreClient`

Defined in: [content/src/client/sitecore-client.ts:314](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L314)

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

Defined in: [content/src/client/sitecore-client.ts:304](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L304)

***

### componentService

> `protected` **componentService**: [`ComponentLayoutService`](../../editing/classes/ComponentLayoutService.md)

Defined in: [content/src/client/sitecore-client.ts:306](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L306)

***

### dictionaryService

> `protected` **dictionaryService**: [`DictionaryService`](../../i18n/classes/DictionaryService.md)

Defined in: [content/src/client/sitecore-client.ts:302](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L302)

***

### edgeInitialized

> **edgeInitialized**: `boolean` = `true`

Defined in: [content/src/client/sitecore-client.ts:300](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L300)

***

### editingService

> `protected` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

Defined in: [content/src/client/sitecore-client.ts:303](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L303)

***

### errorPagesService

> `protected` **errorPagesService**: [`ErrorPagesService`](../../site/classes/ErrorPagesService.md)

Defined in: [content/src/client/sitecore-client.ts:305](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L305)

***

### graphQLClient

> `protected` **graphQLClient**: [`GraphQLClient`](../interfaces/GraphQLClient.md)

Defined in: [content/src/client/sitecore-client.ts:308](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L308)

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [content/src/client/sitecore-client.ts:314](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L314)

initOptions for the client, containing site and Sitecore connection details

***

### layoutService

> `protected` **layoutService**: [`LayoutService`](../../layout/classes/LayoutService.md)

Defined in: [content/src/client/sitecore-client.ts:301](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L301)

***

### sitePathService

> `protected` **sitePathService**: [`SitePathService`](../../site/classes/SitePathService.md)

Defined in: [content/src/client/sitecore-client.ts:307](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L307)

## Methods

### applyContentRewrite()

> `protected` **applyContentRewrite**(`layout`): [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)

Defined in: [content/src/client/sitecore-client.ts:794](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L794)

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

Defined in: [content/src/client/sitecore-client.ts:773](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L773)

#### Returns

`BaseServiceOptions`

***

### getData()

> **getData**\<`T`\>(`query`, `variables?`, `fetchOptions?`): `Promise`\<`T`\>

Defined in: [content/src/client/sitecore-client.ts:360](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L360)

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

Defined in: [content/src/client/sitecore-client.ts:552](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L552)

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

Defined in: [content/src/client/sitecore-client.ts:465](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L465)

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

Defined in: [content/src/client/sitecore-client.ts:607](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L607)

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

Defined in: [content/src/client/sitecore-client.ts:480](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L480)

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

Defined in: [content/src/client/sitecore-client.ts:752](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L752)

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

Defined in: [content/src/client/sitecore-client.ts:422](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L422)

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

### getLlmsTxt()

> **getLlmsTxt**(`options`, `fetchOptions?`): `Promise`\<`string` \| `null`\>

Defined in: [content/src/client/sitecore-client.ts:741](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L741)

Retrieves the llms.txt content (managed via Sitecore AI) for a given site.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`LlmsTxtOptions`](../type-aliases/LlmsTxtOptions.md) | Options containing the site name to retrieve the llms.txt for. |
| `fetchOptions?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Optional fetch options. |

#### Returns

`Promise`\<`string` \| `null`\>

A promise that resolves to the llms.txt content,
or null if no content is found.

#### Implementation of

`BaseSitecoreClient.getLlmsTxt`

***

### getLlmsTxtService()

> `protected` **getLlmsTxtService**(`siteName`): [`LlmsTxtService`](../../site/classes/LlmsTxtService.md)

Defined in: [content/src/client/sitecore-client.ts:766](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L766)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`LlmsTxtService`](../../site/classes/LlmsTxtService.md)

***

### getPage()

> **getPage**(`path`, `pageOptions?`, `fetchOptions?`): `Promise`\<[`Page`](../type-aliases/Page.md) \| `null`\>

Defined in: [content/src/client/sitecore-client.ts:375](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L375)

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

Defined in: [content/src/client/sitecore-client.ts:657](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L657)

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

Defined in: [content/src/client/sitecore-client.ts:495](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L495)

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

Defined in: [content/src/client/sitecore-client.ts:728](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L728)

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

Defined in: [content/src/client/sitecore-client.ts:759](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L759)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`RobotsService`](../../site/classes/RobotsService.md)

***

### getSiteMap()

> **getSiteMap**(`reqOptions`, `fetchOptions?`): `Promise`\<`string`\>

Defined in: [content/src/client/sitecore-client.ts:672](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L672)

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

Defined in: [content/src/client/sitecore-client.ts:341](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/client/sitecore-client.ts#L341)

Normalize path regardless of type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | string or string array path |

#### Returns

`string`

string path
