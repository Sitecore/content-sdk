[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [packages/core/src/client/sitecore-client.ts:156](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L156)

This is a generic content client that can be used by any framework.
Use it to retrieve pages, preview data, dictionary and other data

## Implements

- `BaseSitecoreClient`

## Constructors

### new SitecoreClient()

> **new SitecoreClient**(`initOptions`): [`SitecoreClient`](SitecoreClient.md)

Defined in: [packages/core/src/client/sitecore-client.ts:170](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L170)

Init SitecoreClient

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `initOptions` | [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md) | initOptions for the client, containing site and Sitecore connection details |

#### Returns

[`SitecoreClient`](SitecoreClient.md)

## Properties

### clientFactory

> `protected` **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/client/sitecore-client.ts:161](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L161)

***

### componentService

> `protected` **componentService**: [`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:163](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L163)

***

### dictionaryService

> `protected` **dictionaryService**: [`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:158](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L158)

***

### editingService

> `protected` **editingService**: [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:160](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L160)

***

### errorPagesService

> `protected` **errorPagesService**: [`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:162](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L162)

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [packages/core/src/client/sitecore-client.ts:170](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L170)

initOptions for the client, containing site and Sitecore connection details

***

### layoutService

> `protected` **layoutService**: [`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:157](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L157)

***

### sitePathService

> `protected` **sitePathService**: [`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:164](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L164)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../site/classes/SiteResolver.md)

Defined in: [packages/core/src/client/sitecore-client.ts:159](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L159)

## Methods

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: [packages/core/src/client/sitecore-client.ts:495](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L495)

#### Returns

`BaseServiceOptions`

***

### getClientFactory()

> `protected` **getClientFactory**(): [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/client/sitecore-client.ts:503](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L503)

#### Returns

[`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

***

### getComponentService()

> `protected` **getComponentService**(): [`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:543](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L543)

#### Returns

[`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

***

### getDesignLibraryData()

> **getDesignLibraryData**(`designLibData`, `fetchOptions`?): `Promise`\<[`Page`](../type-aliases/Page.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:376](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L376)

Get design library page details for Design Library mode of your app

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `designLibData` | [`DesignLibraryRenderPreviewData`](../../editing/interfaces/DesignLibraryRenderPreviewData.md) | preview data set in 'library' mode of the app |
| `fetchOptions`? | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<[`Page`](../type-aliases/Page.md)\>

preview page for Design Library

***

### getDictionary()

> **getDictionary**(`routeOptions`?, `fetchOptions`?): `Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:294](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L294)

Retrieves dictionary phrases for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions`? | `Partial`\<[`RouteOptions`](../../layout/type-aliases/RouteOptions.md)\> | Route options containing language and site name to load dictionary for |
| `fetchOptions`? | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

A promise that resolves to the dictionary phrases.

#### Implementation of

`BaseSitecoreClient.getDictionary`

***

### getDictionaryService()

> `protected` **getDictionaryService**(`baseOptions`): [`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:523](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L523)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseOptions` | `BaseServiceOptions` |

#### Returns

[`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

***

### getEditingService()

> `protected` **getEditingService**(): [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:531](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L531)

#### Returns

[`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

***

### getErrorPages()

> **getErrorPages**(`routeOptions`?, `fetchOptions`?): `Promise`\<`null` \| [`ErrorPages`](../../site/type-aliases/ErrorPages.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:309](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L309)

Retrieves error pages for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions`? | [`RouteOptions`](../../layout/type-aliases/RouteOptions.md) | Route options containing language and site name to load error pages |
| `fetchOptions`? | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<`null` \| [`ErrorPages`](../../site/type-aliases/ErrorPages.md)\>

A promise that resolves to the error pages or null if not found.

#### Implementation of

`BaseSitecoreClient.getErrorPages`

***

### getErrorPagesService()

> `protected` **getErrorPagesService**(): [`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:535](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L535)

#### Returns

[`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

***

### getGraphqlSitemapXMLService()

> `protected` **getGraphqlSitemapXMLService**(`siteName`): [`GraphQLSitemapXmlService`](../../site/classes/GraphQLSitemapXmlService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:488](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L488)

Factory methods for creating dependencies
Subclasses can override these to provide custom implementations.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`GraphQLSitemapXmlService`](../../site/classes/GraphQLSitemapXmlService.md)

***

### getHeadLinks()

> **getHeadLinks**(`layoutData`, `options`?): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Defined in: [packages/core/src/client/sitecore-client.ts:268](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L268)

Retrieves the head `<link>` elements for Sitecore styles and themes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md) | The layout data containing styles and themes. |
| `options`? | \{ `enableStyles`: `boolean`; `enableThemes`: `boolean`; \} | Optional configuration for enabling styles and themes. |
| `options.enableStyles`? | `boolean` | Whether to include content styles. |
| `options.enableThemes`? | `boolean` | Whether to include theme styles. |

#### Returns

[`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

An array of `<link>` elements for stylesheets.

#### Implementation of

`BaseSitecoreClient.getHeadLinks`

***

### getLayoutService()

> `protected` **getLayoutService**(`baseOptions`): [`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:516](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L516)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseOptions` | `BaseServiceOptions` |

#### Returns

[`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

***

### getPage()

> **getPage**(`path`, `pageOptions`?, `fetchOptions`?): `Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:218](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L218)

Get page details for a route, with layout and other details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | route path |
| `pageOptions`? | [`PageOptions`](../type-aliases/PageOptions.md) | site, language and personalization variant details for route |
| `fetchOptions`? | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

page details

#### Implementation of

`BaseSitecoreClient.getPage`

***

### getPagePaths()

> **getPagePaths**(`languages`?, `fetchOptions`?): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: [packages/core/src/client/sitecore-client.ts:429](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L429)

Retrieves the static paths for pages based on the given languages.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `languages`? | `string`[] | An optional array of language codes to generate paths for. |
| `fetchOptions`? | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch options. |

#### Returns

`Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

A promise that resolves to an array of static paths.

#### Implementation of

`BaseSitecoreClient.getPagePaths`

***

### getPreview()

> **getPreview**(`previewData`, `fetchOptions`?): `Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:324](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L324)

Retrieves preview page and layout details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `previewData` | `undefined` \| [`EditingPreviewData`](../../editing/type-aliases/EditingPreviewData.md) | The editing preview data for metadata mode. |
| `fetchOptions`? | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

preview page details

#### Implementation of

`BaseSitecoreClient.getPreview`

***

### getSiteMap()

> **getSiteMap**(`reqOptions`, `fetchOptions`?): `Promise`\<`string`\>

Defined in: [packages/core/src/client/sitecore-client.ts:440](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L440)

Retrieves sitemap XML content - either a specific sitemap or the index of all sitemaps.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `reqOptions` | [`SitemapXmlOptions`](../type-aliases/SitemapXmlOptions.md) | Options for sitemap retrieval |
| `fetchOptions`? | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch options. |

#### Returns

`Promise`\<`string`\>

Promise resolving to the sitemap XML content as string

#### Throws

Throws 'REDIRECT_404' if requested sitemap is not found

#### Implementation of

`BaseSitecoreClient.getSiteMap`

***

### getSitePathService()

> `protected` **getSitePathService**(): [`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:551](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L551)

#### Returns

[`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

***

### getSiteResolver()

> `protected` **getSiteResolver**(): [`SiteResolver`](../../site/classes/SiteResolver.md)

Defined in: [packages/core/src/client/sitecore-client.ts:512](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L512)

#### Returns

[`SiteResolver`](../../site/classes/SiteResolver.md)

***

### parsePath()

> **parsePath**(`path`): `string`

Defined in: [packages/core/src/client/sitecore-client.ts:199](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L199)

Normalize path regardless of type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | string or string array path |

#### Returns

`string`

string path

***

### resolveSite()

> **resolveSite**(`hostname`): [`SiteInfo`](../../site/type-aliases/SiteInfo.md)

Defined in: [packages/core/src/client/sitecore-client.ts:189](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/client/sitecore-client.ts#L189)

Resolve site by hostname

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hostname` | `string` | site hostname |

#### Returns

[`SiteInfo`](../../site/type-aliases/SiteInfo.md)

site details matching the hostname

#### Implementation of

`BaseSitecoreClient.resolveSite`
