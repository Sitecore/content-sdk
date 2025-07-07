[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:29](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L29)

## Extends

- `SitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreNextjsClient`

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:31](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L31)

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

Defined in: core/types/client/sitecore-client.d.ts:135

#### Inherited from

`SitecoreClient.clientFactory`

***

### componentPropsService

> `protected` **componentPropsService**: [`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:30](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L30)

***

### componentService

> `protected` **componentService**: [`ComponentLayoutService`](../../index/classes/ComponentLayoutService.md)

Defined in: core/types/client/sitecore-client.d.ts:137

#### Inherited from

`SitecoreClient.componentService`

***

### dictionaryService

> `protected` **dictionaryService**: [`DictionaryService`](../../index/classes/DictionaryService.md)

Defined in: core/types/client/sitecore-client.d.ts:133

#### Inherited from

`SitecoreClient.dictionaryService`

***

### editingService

> `protected` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

Defined in: core/types/client/sitecore-client.d.ts:134

#### Inherited from

`SitecoreClient.editingService`

***

### errorPagesService

> `protected` **errorPagesService**: [`ErrorPagesService`](../../index/classes/ErrorPagesService.md)

Defined in: core/types/client/sitecore-client.d.ts:136

#### Inherited from

`SitecoreClient.errorPagesService`

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:31](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L31)

#### Inherited from

`SitecoreClient.initOptions`

***

### layoutService

> `protected` **layoutService**: [`LayoutService`](../../index/classes/LayoutService.md)

Defined in: core/types/client/sitecore-client.d.ts:132

#### Inherited from

`SitecoreClient.layoutService`

***

### sitePathService

> `protected` **sitePathService**: [`SitePathService`](../../index/classes/SitePathService.md)

Defined in: core/types/client/sitecore-client.d.ts:138

#### Inherited from

`SitecoreClient.sitePathService`

## Methods

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: core/types/client/sitecore-client.d.ts:228

#### Returns

`BaseServiceOptions`

#### Inherited from

`SitecoreClient.getBaseServiceOptions`

***

### getComponentData()

> **getComponentData**(`layoutData`, `context`, `components`): `Promise`\<[`ComponentPropsCollection`](../../index/type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:101](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L101)

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

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:132](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L132)

#### Returns

[`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

***

### getDesignLibraryData()

> **getDesignLibraryData**(`designLibData`, `fetchOptions?`): `Promise`\<`Page`\>

Defined in: core/types/client/sitecore-client.d.ts:197

Get design library page details for Design Library mode of your app

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `designLibData` | `DesignLibraryRenderPreviewData` | preview data set in 'library' mode of the app |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests |

#### Returns

`Promise`\<`Page`\>

preview page for Design Library

#### Inherited from

`SitecoreClient.getDesignLibraryData`

***

### getDictionary()

> **getDictionary**(`routeOptions?`, `fetchOptions?`): `Promise`\<[`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md)\>

Defined in: core/types/client/sitecore-client.d.ts:176

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

### getErrorPages()

> **getErrorPages**(`routeOptions?`, `fetchOptions?`): `Promise`\<`null` \| [`ErrorPages`](../../index/type-aliases/ErrorPages.md)\>

Defined in: core/types/client/sitecore-client.d.ts:183

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

Defined in: core/types/client/sitecore-client.d.ts:226

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

Defined in: core/types/client/sitecore-client.d.ts:166

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

> **getPage**(`path`, `pageOptions`, `options?`): `Promise`\<`null` \| [`NextjsPage`](../type-aliases/NextjsPage.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:58](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L58)

Get page details for a route, with layout and other details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | route path |
| `pageOptions` | `PageOptions` | site, language and personalization variant details for route |
| `options?` | `FetchOptions` | - |

#### Returns

`Promise`\<`null` \| [`NextjsPage`](../type-aliases/NextjsPage.md)\>

page details

#### Overrides

`SitecoreClient.getPage`

***

### getPagePaths()

> **getPagePaths**(`sites`, `languages?`, `fetchOptions?`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: core/types/client/sitecore-client.d.ts:205

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

> **getPreview**(`previewData`, `fetchOptions?`): `Promise`\<`null` \| [`NextjsPage`](../type-aliases/NextjsPage.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:86](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L86)

Retrieves preview page and layout details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `previewData` | `PreviewData` | The editing preview data for metadata mode. |
| `fetchOptions?` | `FetchOptions` | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<`null` \| [`NextjsPage`](../type-aliases/NextjsPage.md)\>

#### Overrides

`SitecoreClient.getPreview`

***

### getRobots()

> **getRobots**(`siteName`, `fetchOptions?`): `Promise`\<`null` \| `string`\>

Defined in: core/types/client/sitecore-client.d.ts:221

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

Defined in: core/types/client/sitecore-client.d.ts:227

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

Defined in: core/types/client/sitecore-client.d.ts:213

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

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:41](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L41)

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

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:53](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/nextjs/src/client/sitecore-nextjs-client.ts#L53)

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
