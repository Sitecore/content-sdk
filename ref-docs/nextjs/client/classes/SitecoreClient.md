[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:26](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L26)

## Extends

- `SitecoreClient`

## Constructors

### new SitecoreClient()

> **new SitecoreClient**(`initOptions`): [`SitecoreClient`](SitecoreClient.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:28](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `initOptions` | [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md) |

#### Returns

[`SitecoreClient`](SitecoreClient.md)

#### Overrides

`SitecoreClient.constructor`

## Properties

### clientFactory

> `protected` **clientFactory**: [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

Defined in: core/types/client/sitecore-client.d.ts:103

#### Inherited from

`SitecoreClient.clientFactory`

***

### componentPropsService

> `protected` **componentPropsService**: [`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:27](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L27)

***

### componentService

> `protected` **componentService**: [`RestComponentLayoutService`](../../index/classes/RestComponentLayoutService.md)

Defined in: core/types/client/sitecore-client.d.ts:105

#### Inherited from

`SitecoreClient.componentService`

***

### dictionaryService

> `protected` **dictionaryService**: [`GraphQLDictionaryService`](../../index/classes/GraphQLDictionaryService.md)

Defined in: core/types/client/sitecore-client.d.ts:100

#### Inherited from

`SitecoreClient.dictionaryService`

***

### editingService

> `protected` **editingService**: [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

Defined in: core/types/client/sitecore-client.d.ts:102

#### Inherited from

`SitecoreClient.editingService`

***

### errorPagesService

> `protected` **errorPagesService**: [`GraphQLErrorPagesService`](../../index/classes/GraphQLErrorPagesService.md)

Defined in: core/types/client/sitecore-client.d.ts:104

#### Inherited from

`SitecoreClient.errorPagesService`

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:28](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L28)

#### Inherited from

`SitecoreClient.initOptions`

***

### layoutService

> `protected` **layoutService**: [`GraphQLLayoutService`](../../index/classes/GraphQLLayoutService.md)

Defined in: core/types/client/sitecore-client.d.ts:99

#### Inherited from

`SitecoreClient.layoutService`

***

### sitePathService

> `protected` **sitePathService**: [`GraphQLSitePathService`](../../index/classes/GraphQLSitePathService.md)

Defined in: core/types/client/sitecore-client.d.ts:106

#### Inherited from

`SitecoreClient.sitePathService`

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: core/types/client/sitecore-client.d.ts:101

#### Inherited from

`SitecoreClient.siteResolver`

## Methods

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: core/types/client/sitecore-client.d.ts:183

Factory methods for creating dependencies
Subclasses can override these to provide custom implementations.

#### Returns

`BaseServiceOptions`

#### Inherited from

`SitecoreClient.getBaseServiceOptions`

***

### getClientFactory()

> `protected` **getClientFactory**(): [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

Defined in: core/types/client/sitecore-client.d.ts:184

#### Returns

[`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

#### Inherited from

`SitecoreClient.getClientFactory`

***

### getComponentData()

> **getComponentData**(`layoutData`, `context`, `moduleFactory`): `Promise`\<[`ComponentPropsCollection`](../../index/type-aliases/ComponentPropsCollection.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:96](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L96)

Parses components from nextjs component factory and layoutData, executes getServerProps/getStaticProps methods
and returns resulting props from components

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md) | layout data to parse compnents from |
| `context` | `GetServerSidePropsContext` \| `GetStaticPropsContext` | Nextjs preview data |
| `moduleFactory` | [`ModuleFactory`](../../index/type-aliases/ModuleFactory.md) | module factory to use for component parsing |

#### Returns

`Promise`\<[`ComponentPropsCollection`](../../index/type-aliases/ComponentPropsCollection.md)\>

component props

***

### getComponentLibraryData()

> **getComponentLibraryData**(`componentLibData`, `fetchOptions`?): `Promise`\<`Page`\>

Defined in: core/types/client/sitecore-client.d.ts:171

Get component library page details for Component Library mode of your app

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentLibData` | `ComponentLibraryRenderPreviewData` | preview data set in 'library' mode of the app |
| `fetchOptions`? | `FetchOptions` | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<`Page`\>

preview page for Component Library

#### Inherited from

`SitecoreClient.getComponentLibraryData`

***

### getComponentPropsService()

> `protected` **getComponentPropsService**(): [`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:127](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L127)

#### Returns

[`ComponentPropsService`](../../index/classes/ComponentPropsService.md)

***

### getComponentService()

> `protected` **getComponentService**(): [`RestComponentLayoutService`](../../index/classes/RestComponentLayoutService.md)

Defined in: core/types/client/sitecore-client.d.ts:190

#### Returns

[`RestComponentLayoutService`](../../index/classes/RestComponentLayoutService.md)

#### Inherited from

`SitecoreClient.getComponentService`

***

### getDictionary()

> **getDictionary**(`routeOptions`?, `fetchOptions`?): `Promise`\<[`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md)\>

Defined in: core/types/client/sitecore-client.d.ts:150

Retrieves dictionary phrases for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions`? | `Partial`\<`RouteOptions`\> | Route options containing language and site name to load dictionary for |
| `fetchOptions`? | `FetchOptions` | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<[`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md)\>

A promise that resolves to the dictionary phrases.

#### Inherited from

`SitecoreClient.getDictionary`

***

### getDictionaryService()

> `protected` **getDictionaryService**(`baseOptions`): [`GraphQLDictionaryService`](../../index/classes/GraphQLDictionaryService.md)

Defined in: core/types/client/sitecore-client.d.ts:187

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseOptions` | `BaseServiceOptions` |

#### Returns

[`GraphQLDictionaryService`](../../index/classes/GraphQLDictionaryService.md)

#### Inherited from

`SitecoreClient.getDictionaryService`

***

### getEditingService()

> `protected` **getEditingService**(): [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

Defined in: core/types/client/sitecore-client.d.ts:188

#### Returns

[`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

#### Inherited from

`SitecoreClient.getEditingService`

***

### getErrorPages()

> **getErrorPages**(`routeOptions`?, `fetchOptions`?): `Promise`\<`null` \| [`ErrorPages`](../../index/type-aliases/ErrorPages.md)\>

Defined in: core/types/client/sitecore-client.d.ts:157

Retrieves error pages for a given site and locale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeOptions`? | `RouteOptions` | Route options containing language and site name to load error pages |
| `fetchOptions`? | `FetchOptions` | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<`null` \| [`ErrorPages`](../../index/type-aliases/ErrorPages.md)\>

A promise that resolves to the error pages or null if not found.

#### Inherited from

`SitecoreClient.getErrorPages`

***

### getErrorPagesService()

> `protected` **getErrorPagesService**(): [`GraphQLErrorPagesService`](../../index/classes/GraphQLErrorPagesService.md)

Defined in: core/types/client/sitecore-client.d.ts:189

#### Returns

[`GraphQLErrorPagesService`](../../index/classes/GraphQLErrorPagesService.md)

#### Inherited from

`SitecoreClient.getErrorPagesService`

***

### getHeadLinks()

> **getHeadLinks**(`layoutData`, `options`?): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Defined in: core/types/client/sitecore-client.d.ts:140

Retrieves the head `<link>` elements for Sitecore styles and themes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md) | The layout data containing styles and themes. |
| `options`? | \{ `enableStyles`: `boolean`; `enableThemes`: `boolean`; \} | Optional configuration for enabling styles and themes. |
| `options.enableStyles`? | `boolean` | Whether to include content styles. |
| `options.enableThemes`? | `boolean` | Whether to include theme styles. |

#### Returns

[`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

An array of `<link>` elements for stylesheets.

#### Inherited from

`SitecoreClient.getHeadLinks`

***

### getLayoutService()

> `protected` **getLayoutService**(`baseOptions`): [`GraphQLLayoutService`](../../index/classes/GraphQLLayoutService.md)

Defined in: core/types/client/sitecore-client.d.ts:186

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseOptions` | `BaseServiceOptions` |

#### Returns

[`GraphQLLayoutService`](../../index/classes/GraphQLLayoutService.md)

#### Inherited from

`SitecoreClient.getLayoutService`

***

### getPage()

> **getPage**(`path`, `pageOptions`, `options`?): `Promise`\<`null` \| [`NextjsPage`](../type-aliases/NextjsPage.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:53](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L53)

Get page details for a route, with layout and other details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` \| `string`[] | route path |
| `pageOptions` | `PageOptions` | site, language and personalization variant details for route |
| `options`? | `FetchOptions` | - |

#### Returns

`Promise`\<`null` \| [`NextjsPage`](../type-aliases/NextjsPage.md)\>

page details

#### Overrides

`SitecoreClient.getPage`

***

### getPagePaths()

> **getPagePaths**(`languages`?, `fetchOptions`?): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: core/types/client/sitecore-client.d.ts:178

Retrieves the static paths for pages based on the given languages.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `languages`? | `string`[] | An optional array of language codes to generate paths for. |
| `fetchOptions`? | `FetchOptions` | Additional fetch options. |

#### Returns

`Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

A promise that resolves to an array of static paths.

#### Inherited from

`SitecoreClient.getPagePaths`

***

### getPreview()

> **getPreview**(`previewData`, `fetchOptions`?): `Promise`\<`null` \| [`NextjsPage`](../type-aliases/NextjsPage.md)\>

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:81](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L81)

Retrieves preview page and layout details

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `previewData` | `PreviewData` | The editing preview data for metadata mode. |
| `fetchOptions`? | `FetchOptions` | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<`null` \| [`NextjsPage`](../type-aliases/NextjsPage.md)\>

#### Overrides

`SitecoreClient.getPreview`

***

### getSitePathService()

> `protected` **getSitePathService**(): [`GraphQLSitePathService`](../../index/classes/GraphQLSitePathService.md)

Defined in: core/types/client/sitecore-client.d.ts:191

#### Returns

[`GraphQLSitePathService`](../../index/classes/GraphQLSitePathService.md)

#### Inherited from

`SitecoreClient.getSitePathService`

***

### getSiteResolver()

> `protected` **getSiteResolver**(): [`SiteResolver`](../../index/classes/SiteResolver.md)

Defined in: core/types/client/sitecore-client.d.ts:185

#### Returns

[`SiteResolver`](../../index/classes/SiteResolver.md)

#### Inherited from

`SitecoreClient.getSiteResolver`

***

### parsePath()

> **parsePath**(`path`): `string`

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:48](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L48)

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

***

### resolveSite()

> **resolveSite**(`hostname`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: core/types/client/sitecore-client.d.ts:117

Resolve site by hostname

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hostname` | `string` | site hostname |

#### Returns

[`SiteInfo`](../../index/type-aliases/SiteInfo.md)

site details matching the hostname

#### Inherited from

`SitecoreClient.resolveSite`

***

### resolveSiteFromPath()

> **resolveSiteFromPath**(`path`): [`SiteInfo`](../../index/type-aliases/SiteInfo.md)

Defined in: [nextjs/src/client/sitecore-nextjs-client.ts:34](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/client/sitecore-nextjs-client.ts#L34)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | `string` \| `string`[] |

#### Returns

[`SiteInfo`](../../index/type-aliases/SiteInfo.md)
