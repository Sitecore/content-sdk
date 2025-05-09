[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [packages/core/src/client/sitecore-client.ts:183](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L183)

This is a generic content client that can be used by any framework.
Use it to retrieve pages, preview data, dictionary and other data

## Implements

- `BaseSitecoreClient`

## Constructors

### Constructor

> **new SitecoreClient**(`initOptions`): `SitecoreClient`

Defined in: [packages/core/src/client/sitecore-client.ts:197](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L197)

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

Defined in: [packages/core/src/client/sitecore-client.ts:188](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L188)

***

### componentService

> `protected` **componentService**: [`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:190](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L190)

***

### dictionaryService

> `protected` **dictionaryService**: [`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:185](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L185)

***

### editingService

> `protected` **editingService**: [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:187](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L187)

***

### errorPagesService

> `protected` **errorPagesService**: [`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:189](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L189)

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [packages/core/src/client/sitecore-client.ts:197](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L197)

initOptions for the client, containing site and Sitecore connection details

***

### layoutService

> `protected` **layoutService**: [`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:184](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L184)

***

### sitePathService

> `protected` **sitePathService**: [`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:191](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L191)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../site/classes/SiteResolver.md)

Defined in: [packages/core/src/client/sitecore-client.ts:186](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L186)

## Methods

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: [packages/core/src/client/sitecore-client.ts:546](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L546)

#### Returns

`BaseServiceOptions`

***

### getClientFactory()

> `protected` **getClientFactory**(): [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/client/sitecore-client.ts:554](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L554)

#### Returns

[`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

***

### getComponentService()

> `protected` **getComponentService**(): [`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:594](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L594)

#### Returns

[`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

***

### getDesignLibraryData()

> **getDesignLibraryData**(`designLibData`, `fetchOptions?`): `Promise`\<[`Page`](../type-aliases/Page.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:403](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L403)

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

Defined in: [packages/core/src/client/sitecore-client.ts:321](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L321)

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

### getDictionaryService()

> `protected` **getDictionaryService**(`baseOptions`): [`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:574](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L574)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseOptions` | `BaseServiceOptions` |

#### Returns

[`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

***

### getEditingService()

> `protected` **getEditingService**(): [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:582](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L582)

#### Returns

[`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

***

### getErrorPages()

> **getErrorPages**(`routeOptions?`, `fetchOptions?`): `Promise`\<`null` \| [`ErrorPages`](../../site/type-aliases/ErrorPages.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:336](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L336)

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

### getErrorPagesService()

> `protected` **getErrorPagesService**(): [`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:586](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L586)

#### Returns

[`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

***

### getGraphqlSitemapXMLService()

> `protected` **getGraphqlSitemapXMLService**(`siteName`): [`GraphQLSitemapXmlService`](../../site/classes/GraphQLSitemapXmlService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:532](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L532)

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

> **getHeadLinks**(`layoutData`, `options?`): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Defined in: [packages/core/src/client/sitecore-client.ts:295](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L295)

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

### getLayoutService()

> `protected` **getLayoutService**(`baseOptions`): [`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:567](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L567)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseOptions` | `BaseServiceOptions` |

#### Returns

[`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

***

### getPage()

> **getPage**(`path`, `pageOptions?`, `fetchOptions?`): `Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:245](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L245)

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

> **getPagePaths**(`languages?`, `fetchOptions?`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: [packages/core/src/client/sitecore-client.ts:456](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L456)

Retrieves the static paths for pages based on the given languages.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
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

Defined in: [packages/core/src/client/sitecore-client.ts:351](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L351)

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

Defined in: [packages/core/src/client/sitecore-client.ts:521](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L521)

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

> `protected` **getRobotsService**(`siteName`): [`GraphQLRobotsService`](../../site/classes/GraphQLRobotsService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:539](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L539)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |

#### Returns

[`GraphQLRobotsService`](../../site/classes/GraphQLRobotsService.md)

***

### getSiteMap()

> **getSiteMap**(`reqOptions`, `fetchOptions?`): `Promise`\<`string`\>

Defined in: [packages/core/src/client/sitecore-client.ts:467](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L467)

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

### getSitePathService()

> `protected` **getSitePathService**(): [`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:602](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L602)

#### Returns

[`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

***

### getSiteResolver()

> `protected` **getSiteResolver**(): [`SiteResolver`](../../site/classes/SiteResolver.md)

Defined in: [packages/core/src/client/sitecore-client.ts:563](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L563)

#### Returns

[`SiteResolver`](../../site/classes/SiteResolver.md)

***

### parsePath()

> **parsePath**(`path`): `string`

Defined in: [packages/core/src/client/sitecore-client.ts:226](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L226)

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

Defined in: [packages/core/src/client/sitecore-client.ts:216](https://github.com/Sitecore/content-sdk/blob/201a4457308c1dedee029dd750f141e134f79a00/packages/core/src/client/sitecore-client.ts#L216)

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
