[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:40](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L40)

The SitecoreNextjsClient class extends the SitecoreClient class to provide additional functionality for Next.js.

## Extends

- `SitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreNextjsClient`

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:42](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L42)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `initOptions` | `SitecoreNextjsClientInit` |

#### Returns

`SitecoreNextjsClient`

#### Overrides

`SitecoreClient.constructor`

## Properties

### clientFactory

> `protected` **clientFactory**: [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

Defined in: content/types/client/sitecore-client.d.ts:211

#### Inherited from

`SitecoreClient.clientFactory`

***

### componentPropsService

> `protected` **componentPropsService**: [`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:41](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L41)

***

### componentService

> `protected` **componentService**: [`ComponentLayoutService`](../../index/classes/ComponentLayoutService.md)

Defined in: content/types/client/sitecore-client.d.ts:213

#### Inherited from

`SitecoreClient.componentService`

***

### dictionaryService

> `protected` **dictionaryService**: [`DictionaryService`](../../index/classes/DictionaryService.md)

Defined in: content/types/client/sitecore-client.d.ts:209

#### Inherited from

`SitecoreClient.dictionaryService`

***

### editingService

> `protected` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

Defined in: content/types/client/sitecore-client.d.ts:210

#### Inherited from

`SitecoreClient.editingService`

***

### errorPagesService

> `protected` **errorPagesService**: [`ErrorPagesService`](../../index/classes/ErrorPagesService.md)

Defined in: content/types/client/sitecore-client.d.ts:212

#### Inherited from

`SitecoreClient.errorPagesService`

***

### graphQLClient

> `protected` **graphQLClient**: `GraphQLClient`

Defined in: content/types/client/sitecore-client.d.ts:215

#### Inherited from

`SitecoreClient.graphQLClient`

***

### initOptions

> `protected` **initOptions**: `SitecoreNextjsClientInit`

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:42](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L42)

#### Inherited from

`SitecoreClient.initOptions`

***

### layoutService

> `protected` **layoutService**: [`LayoutService`](../../index/classes/LayoutService.md)

Defined in: content/types/client/sitecore-client.d.ts:208

#### Inherited from

`SitecoreClient.layoutService`

***

### sitePathService

> `protected` **sitePathService**: [`SitePathService`](../../index/classes/SitePathService.md)

Defined in: content/types/client/sitecore-client.d.ts:214

#### Inherited from

`SitecoreClient.sitePathService`

## Methods

### applyContentRewrite()

> `protected` **applyContentRewrite**(`layout`): [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md)

Defined in: content/types/client/sitecore-client.d.ts:335

**`Internal`**

Applies media URL rewrite when rewriteMediaUrls is enabled.
When true, uses default Edge host rewriter; when a function, transforms each string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layout` | [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md) | Layout data from layout/editing/component/error service |

#### Returns

[`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md)

Rewritten layout (or same reference if rewrite disabled)

#### Inherited from

`SitecoreClient.applyContentRewrite`

***

### getAppRouterStaticParams()

> **getAppRouterStaticParams**(`sites`, `languages?`, `fetchOptions?`): `Promise`\<`StaticParams`[]\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:131](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L131)

Generates static params for the Next.js App Router from Sitecore routes.

Fetches routes for the specified `sites` and `languages`, then converts them into
objects consumable by `generateStaticParams`. Internal multisite segments are removed.
The `site` name is resolved from the path. If a route lacks a locale, the
client's `defaultLanguage` is used.

**NOTE**: App Router only. For the Pages Router, use `getPagePaths`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | `string`[] | An array of site names to fetch routes for. |
| `languages?` | `string`[] | Language codes to generate params for. |
| `fetchOptions?` | `FetchOptions` | Additional fetch options. |

#### Returns

`Promise`\<`StaticParams`[]\>

Array of `{ site, locale, path }` entries for `generateStaticParams`.

***

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: content/types/client/sitecore-client.d.ts:321

#### Returns

`BaseServiceOptions`

#### Inherited from

`SitecoreClient.getBaseServiceOptions`

***

### getComponentData()

> **getComponentData**(`layoutData`, `context`, `components`): `Promise`\<[`ComponentPropsCollection`](../../index/type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:186](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L186)

Parses components from nextjs component map and layoutData, executes getServerProps/getStaticProps methods
and returns resulting props from components

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md) | layout data to parse compnents from |
| `context` | `GetServerSidePropsContext` \| `GetStaticPropsContext` | Nextjs preview data |
| `components` | [`ComponentMap`](../../index/type-aliases/ComponentMap.md)\<[`NextjsContentSdkComponent`](../../index/type-aliases/NextjsContentSdkComponent.md)\> | component map to get props for |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../../index/type-aliases/ComponentPropsCollection.md)\>

component props

***

### getComponentPropsService()

> `protected` **getComponentPropsService**(): [`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:217](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L217)

#### Returns

[`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

***

### getData()

> **getData**\<`T`\>(`query`, `variables?`, `fetchOptions?`): `Promise`\<`T`\>

Defined in: content/types/client/sitecore-client.d.ts:234

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
| `fetchOptions?` | `FetchOptions` | Optional fetch overrides (e.g. fetch, headers) |

#### Returns

`Promise`\<`T`\>

#### Inherited from

`SitecoreClient.getData`

***

### getDesignLibraryData()

> **getDesignLibraryData**(`designLibData`, `fetchOptions?`): `Promise`\<[`Page`](../../index/type-aliases/Page.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:98](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L98)

Get design library page details for Design Library mode of your app

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `designLibData` | `PreviewData` | preview data set in 'library' mode of the app |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`Page`](../../index/type-aliases/Page.md)\>

preview page for Design Library

#### Overrides

`SitecoreClient.getDesignLibraryData`

***

### getDictionary()

> **getDictionary**(`routeOptions?`, `fetchOptions?`): `Promise`\<[`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md)\>

Defined in: content/types/client/sitecore-client.d.ts:261

Retrieves dictionary phrases for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions?` | `Partial`\<`RouteOptions`\> | Route options containing language and site name to load dictionary for |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md)\>

A promise that resolves to the dictionary phrases.

#### Inherited from

`SitecoreClient.getDictionary`

***

### getErrorPage()

> **getErrorPage**(`code`, `pageOptions?`, `fetchOptions?`): `Promise`\<[`Page`](../../index/type-aliases/Page.md) \| `null`\>

Defined in: content/types/client/sitecore-client.d.ts:290

Get error page details for a given error code

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | [`ErrorPage`](../../index/enumerations/ErrorPage.md) | The error code to get the error page for |
| `pageOptions?` | `Partial`\<`RouteOptions`\> | The page options to get the error page for |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`Page`](../../index/type-aliases/Page.md) \| `null`\>

A promise that resolves to the error page details or null if not found

#### Inherited from

`SitecoreClient.getErrorPage`

***

### getErrorPages()

> **getErrorPages**(`routeOptions?`, `fetchOptions?`): `Promise`\<[`ErrorPages`](../../index/type-aliases/ErrorPages.md) \| `null`\>

Defined in: content/types/client/sitecore-client.d.ts:268

Retrieves error pages for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions?` | `RouteOptions` | Route options containing language and site name to load error pages |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<[`ErrorPages`](../../index/type-aliases/ErrorPages.md) \| `null`\>

A promise that resolves to the error pages or null if not found.

#### Inherited from

`SitecoreClient.getErrorPages`

***

### getGraphqlSitemapXMLService()

> `protected` **getGraphqlSitemapXMLService**(`siteName`): [`SitemapXmlService`](../../index/classes/SitemapXmlService.md)

Defined in: content/types/client/sitecore-client.d.ts:319

Factory methods for creating dependencies
Subclasses can override these to provide custom implementations.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`SitemapXmlService`](../../index/classes/SitemapXmlService.md)

#### Inherited from

`SitecoreClient.getGraphqlSitemapXMLService`

***

### getHeadLinks()

> **getHeadLinks**(`layoutData`, `options?`): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Defined in: content/types/client/sitecore-client.d.ts:251

Retrieves the head `<link>` elements for Sitecore styles and themes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md) | The layout data containing styles and themes. |
| `options?` | \{ `enableStyles?`: `boolean`; `enableThemes?`: `boolean`; \} | Optional configuration for enabling styles and themes. |
| `options.enableStyles?` | `boolean` | Whether to include content styles. |
| `options.enableThemes?` | `boolean` | Whether to include theme styles. |

#### Returns

[`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

An array of `<link>` elements for stylesheets.

#### Inherited from

`SitecoreClient.getHeadLinks`

***

### getPage()

> **getPage**(`path`, `pageOptions`, `options?`): `Promise`\<[`Page`](../../index/type-aliases/Page.md) \| `null`\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:69](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L69)

Get page details for a route, with layout and other details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | route path |
| `pageOptions` | `PageOptions` | site, language and personalization variant details for route |
| `options?` | `FetchOptions` | - |

#### Returns

`Promise`\<[`Page`](../../index/type-aliases/Page.md) \| `null`\>

page details

#### Overrides

`SitecoreClient.getPage`

***

### getPagePaths()

> **getPagePaths**(`sites`, `languages?`, `fetchOptions?`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:161](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L161)

Retrieves the static paths for pages based on the given languages.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | `string`[] | An array of site names to fetch routes for. |
| `languages?` | `string`[] | An optional array of language codes to generate paths for. |
| `fetchOptions?` | `FetchOptions` | Additional fetch options. |

#### Returns

`Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

A promise that resolves to an array of static paths.

#### Overrides

`SitecoreClient.getPagePaths`

***

### getPreview()

> **getPreview**(`previewData`, `fetchOptions?`): `Promise`\<[`Page`](../../index/type-aliases/Page.md) \| `null`\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:113](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L113)

Retrieves preview page and layout details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `previewData` | `PreviewData` | The editing preview data for metadata mode. |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<[`Page`](../../index/type-aliases/Page.md) \| `null`\>

#### Overrides

`SitecoreClient.getPreview`

***

### getRobots()

> **getRobots**(`siteName`, `fetchOptions?`): `Promise`\<`string` \| `null`\>

Defined in: content/types/client/sitecore-client.d.ts:314

Retrieves the robots.txt content for a given site name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | The name of the site to retrieve the robots.txt for. |
| `fetchOptions?` | `FetchOptions` | Optional fetch options. |

#### Returns

`Promise`\<`string` \| `null`\>

A promise that resolves to the robots.txt content,
or null if no content is found.

#### Inherited from

`SitecoreClient.getRobots`

***

### getRobotsService()

> `protected` **getRobotsService**(`siteName`): [`RobotsService`](../../index/classes/RobotsService.md)

Defined in: content/types/client/sitecore-client.d.ts:320

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`RobotsService`](../../index/classes/RobotsService.md)

#### Inherited from

`SitecoreClient.getRobotsService`

***

### getSiteMap()

> **getSiteMap**(`reqOptions`, `fetchOptions?`): `Promise`\<`string`\>

Defined in: content/types/client/sitecore-client.d.ts:306

Retrieves sitemap XML content - either a specific sitemap or the index of all sitemaps.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `reqOptions` | `SitemapXmlOptions` | Options for sitemap retrieval |
| `fetchOptions?` | `FetchOptions` | Additional fetch options. |

#### Returns

`Promise`\<`string`\>

Promise resolving to the sitemap XML content as string

#### Throws

Throws 'REDIRECT_404' if requested sitemap is not found

#### Inherited from

`SitecoreClient.getSiteMap`

***

### getSiteNameFromPath()

> **getSiteNameFromPath**(`path`): `string`

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:52](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L52)

Gets site name based on the provided path

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | path to get site name from |

#### Returns

`string`

site name, or default site info if not found

***

### parsePath()

> **parsePath**(`path`): `string`

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:64](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/nextjs/src/client/sitecore-nextjs-client.ts#L64)

Normalizes a nextjs path that could have been rewritten

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | nextjs path |

#### Returns

`string`

path string without nextjs prefixes

#### Overrides

`SitecoreClient.parsePath`
