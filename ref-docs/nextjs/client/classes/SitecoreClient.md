[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:32](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L32)

The SitecoreNextjsClient class extends the SitecoreClient class to provide additional functionality for Next.js.

## Extends

- `SitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreNextjsClient`

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:34](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L34)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `initOptions` | [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md) |

#### Returns

`SitecoreNextjsClient`

#### Overrides

`SitecoreClient.constructor`

## Properties

### clientFactory

> `protected` **clientFactory**: [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

Defined in: core/types/client/sitecore-client.d.ts:211

#### Inherited from

`SitecoreClient.clientFactory`

***

### componentPropsService

> `protected` **componentPropsService**: [`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:33](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L33)

***

### componentService

> `protected` **componentService**: [`ComponentLayoutService`](../../index/classes/ComponentLayoutService.md)

Defined in: core/types/client/sitecore-client.d.ts:213

#### Inherited from

`SitecoreClient.componentService`

***

### dictionaryService

> `protected` **dictionaryService**: [`DictionaryService`](../../index/classes/DictionaryService.md)

Defined in: core/types/client/sitecore-client.d.ts:209

#### Inherited from

`SitecoreClient.dictionaryService`

***

### editingService

> `protected` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

Defined in: core/types/client/sitecore-client.d.ts:210

#### Inherited from

`SitecoreClient.editingService`

***

### errorPagesService

> `protected` **errorPagesService**: [`ErrorPagesService`](../../index/classes/ErrorPagesService.md)

Defined in: core/types/client/sitecore-client.d.ts:212

#### Inherited from

`SitecoreClient.errorPagesService`

***

### graphQLClient

> `protected` **graphQLClient**: `GraphQLClient`

Defined in: core/types/client/sitecore-client.d.ts:215

#### Inherited from

`SitecoreClient.graphQLClient`

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:34](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L34)

#### Inherited from

`SitecoreClient.initOptions`

***

### layoutService

> `protected` **layoutService**: [`LayoutService`](../../index/classes/LayoutService.md)

Defined in: core/types/client/sitecore-client.d.ts:208

#### Inherited from

`SitecoreClient.layoutService`

***

### sitePathService

> `protected` **sitePathService**: [`SitePathService`](../../index/classes/SitePathService.md)

Defined in: core/types/client/sitecore-client.d.ts:214

#### Inherited from

`SitecoreClient.sitePathService`

## Methods

### getAppRouterStaticParams()

> **getAppRouterStaticParams**(`sites`, `languages?`, `fetchOptions?`): `Promise`\<`StaticParams`[]\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:123](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L123)

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

Defined in: core/types/client/sitecore-client.d.ts:321

#### Returns

`BaseServiceOptions`

#### Inherited from

`SitecoreClient.getBaseServiceOptions`

***

### getComponentData()

> **getComponentData**(`layoutData`, `context`, `components`): `Promise`\<[`ComponentPropsCollection`](../../index/type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:154](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L154)

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

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:185](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L185)

#### Returns

[`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

***

### getData()

> **getData**\<`T`\>(`query`, `variables?`, `fetchOptions?`): `Promise`\<`T`\>

Defined in: core/types/client/sitecore-client.d.ts:234

Execute a raw GraphQL request using the client's configured GraphQL Edge endpoint.
This is a thin pass-through to the underlying GraphQLClient.request,

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

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:90](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L90)

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

Defined in: core/types/client/sitecore-client.d.ts:261

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

> **getErrorPage**(`code`, `pageOptions?`, `fetchOptions?`): `Promise`\<`null` \| [`Page`](../../index/type-aliases/Page.md)\>

Defined in: core/types/client/sitecore-client.d.ts:290

Get error page details for a given error code

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `code` | [`ErrorPage`](../../index/enumerations/ErrorPage.md) | The error code to get the error page for |
| `pageOptions?` | `Partial`\<`RouteOptions`\> | The page options to get the error page for |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<`null` \| [`Page`](../../index/type-aliases/Page.md)\>

A promise that resolves to the error page details or null if not found

#### Inherited from

`SitecoreClient.getErrorPage`

***

### getErrorPages()

> **getErrorPages**(`routeOptions?`, `fetchOptions?`): `Promise`\<`null` \| [`ErrorPages`](../../index/type-aliases/ErrorPages.md)\>

Defined in: core/types/client/sitecore-client.d.ts:268

Retrieves error pages for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions?` | `RouteOptions` | Route options containing language and site name to load error pages |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<`null` \| [`ErrorPages`](../../index/type-aliases/ErrorPages.md)\>

A promise that resolves to the error pages or null if not found.

#### Inherited from

`SitecoreClient.getErrorPages`

***

### getGraphqlSitemapXMLService()

> `protected` **getGraphqlSitemapXMLService**(`siteName`): [`SitemapXmlService`](../../index/classes/SitemapXmlService.md)

Defined in: core/types/client/sitecore-client.d.ts:319

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

Defined in: core/types/client/sitecore-client.d.ts:251

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

> **getPage**(`path`, `pageOptions`, `options?`): `Promise`\<`null` \| [`Page`](../../index/type-aliases/Page.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:61](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L61)

Get page details for a route, with layout and other details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | route path |
| `pageOptions` | `PageOptions` | site, language and personalization variant details for route |
| `options?` | `FetchOptions` | - |

#### Returns

`Promise`\<`null` \| [`Page`](../../index/type-aliases/Page.md)\>

page details

#### Overrides

`SitecoreClient.getPage`

***

### getPagePaths()

> **getPagePaths**(`sites`, `languages?`, `fetchOptions?`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: core/types/client/sitecore-client.d.ts:298

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

#### Inherited from

`SitecoreClient.getPagePaths`

***

### getPreview()

> **getPreview**(`previewData`, `fetchOptions?`): `Promise`\<`null` \| [`Page`](../../index/type-aliases/Page.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:105](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L105)

Retrieves preview page and layout details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `previewData` | `PreviewData` | The editing preview data for metadata mode. |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<`null` \| [`Page`](../../index/type-aliases/Page.md)\>

#### Overrides

`SitecoreClient.getPreview`

***

### getRobots()

> **getRobots**(`siteName`, `fetchOptions?`): `Promise`\<`null` \| `string`\>

Defined in: core/types/client/sitecore-client.d.ts:314

Retrieves the robots.txt content for a given site name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | The name of the site to retrieve the robots.txt for. |
| `fetchOptions?` | `FetchOptions` | Optional fetch options. |

#### Returns

`Promise`\<`null` \| `string`\>

A promise that resolves to the robots.txt content,
or null if no content is found.

#### Inherited from

`SitecoreClient.getRobots`

***

### getRobotsService()

> `protected` **getRobotsService**(`siteName`): [`RobotsService`](../../index/classes/RobotsService.md)

Defined in: core/types/client/sitecore-client.d.ts:320

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

Defined in: core/types/client/sitecore-client.d.ts:306

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

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:44](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L44)

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

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:56](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/nextjs/src/client/sitecore-nextjs-client.ts#L56)

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
