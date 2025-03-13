[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitecoreClient

# Class: SitecoreClient

Defined in: [packages/core/src/client/sitecore-client.ts:134](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L134)

This is a generic content client that can be used by any framework.
Use it to retrieve pages, preview data, dictionary and other data

## Implements

- `BaseSitecoreClient`

## Constructors

### new SitecoreClient()

> **new SitecoreClient**(`initOptions`): [`SitecoreClient`](SitecoreClient.md)

Defined in: [packages/core/src/client/sitecore-client.ts:148](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L148)

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

Defined in: [packages/core/src/client/sitecore-client.ts:139](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L139)

***

### componentService

> `protected` **componentService**: [`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:141](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L141)

***

### dictionaryService

> `protected` **dictionaryService**: [`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:136](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L136)

***

### editingService

> `protected` **editingService**: [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:138](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L138)

***

### errorPagesService

> `protected` **errorPagesService**: [`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:140](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L140)

***

### initOptions

> `protected` **initOptions**: [`SitecoreClientInit`](../type-aliases/SitecoreClientInit.md)

Defined in: [packages/core/src/client/sitecore-client.ts:148](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L148)

initOptions for the client, containing site and Sitecore connection details

***

### layoutService

> `protected` **layoutService**: [`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:135](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L135)

***

### sitePathService

> `protected` **sitePathService**: [`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:142](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L142)

***

### siteResolver

> `protected` **siteResolver**: [`SiteResolver`](../../site/classes/SiteResolver.md)

Defined in: [packages/core/src/client/sitecore-client.ts:137](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L137)

## Methods

### getBaseServiceOptions()

> `protected` **getBaseServiceOptions**(): `BaseServiceOptions`

Defined in: [packages/core/src/client/sitecore-client.ts:413](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L413)

Factory methods for creating dependencies
Subclasses can override these to provide custom implementations.

#### Returns

`BaseServiceOptions`

***

### getClientFactory()

> `protected` **getClientFactory**(): [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/client/sitecore-client.ts:421](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L421)

#### Returns

[`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

***

### getComponentLibraryData()

> **getComponentLibraryData**(`componentLibData`, `fetchOptions`?): `Promise`\<[`Page`](../type-aliases/Page.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:349](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L349)

Get component library page details for Component Library mode of your app

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentLibData` | [`ComponentLibraryRenderPreviewData`](../../editing/interfaces/ComponentLibraryRenderPreviewData.md) | preview data set in 'library' mode of the app |
| `fetchOptions`? | [`FetchOptions`](../type-aliases/FetchOptions.md) | Additional fetch fetch options to override GraphQL requests (like retries and fetch) |

#### Returns

`Promise`\<[`Page`](../type-aliases/Page.md)\>

preview page for Component Library

***

### getComponentService()

> `protected` **getComponentService**(): [`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:461](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L461)

#### Returns

[`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

***

### getDictionary()

> **getDictionary**(`routeOptions`?, `fetchOptions`?): `Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:269](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L269)

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

Defined in: [packages/core/src/client/sitecore-client.ts:441](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L441)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseOptions` | `BaseServiceOptions` |

#### Returns

[`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

***

### getEditingService()

> `protected` **getEditingService**(): [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:449](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L449)

#### Returns

[`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

***

### getErrorPages()

> **getErrorPages**(`routeOptions`?, `fetchOptions`?): `Promise`\<`null` \| [`ErrorPages`](../../site/type-aliases/ErrorPages.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:284](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L284)

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

Defined in: [packages/core/src/client/sitecore-client.ts:453](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L453)

#### Returns

[`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

***

### getHeadLinks()

> **getHeadLinks**(`layoutData`, `options`?): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Defined in: [packages/core/src/client/sitecore-client.ts:243](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L243)

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

Defined in: [packages/core/src/client/sitecore-client.ts:434](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L434)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseOptions` | `BaseServiceOptions` |

#### Returns

[`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

***

### getPage()

> **getPage**(`path`, `pageOptions`?, `fetchOptions`?): `Promise`\<`null` \| [`Page`](../type-aliases/Page.md)\>

Defined in: [packages/core/src/client/sitecore-client.ts:196](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L196)

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

Defined in: [packages/core/src/client/sitecore-client.ts:404](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L404)

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

Defined in: [packages/core/src/client/sitecore-client.ts:299](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L299)

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

### getSitePathService()

> `protected` **getSitePathService**(): [`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

Defined in: [packages/core/src/client/sitecore-client.ts:469](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L469)

#### Returns

[`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

***

### getSiteResolver()

> `protected` **getSiteResolver**(): [`SiteResolver`](../../site/classes/SiteResolver.md)

Defined in: [packages/core/src/client/sitecore-client.ts:430](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L430)

#### Returns

[`SiteResolver`](../../site/classes/SiteResolver.md)

***

### parsePath()

> **parsePath**(`path`): `string`

Defined in: [packages/core/src/client/sitecore-client.ts:177](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L177)

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

Defined in: [packages/core/src/client/sitecore-client.ts:167](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/core/src/client/sitecore-client.ts#L167)

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
