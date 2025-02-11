[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / GraphQLEditingService

# Class: GraphQLEditingService

Defined in: [packages/core/src/editing/graphql-editing-service.ts:101](https://github.com/Sitecore/xmc-jss-dev/blob/4e954baaff703857abef880e6218bead13dfe25d/packages/core/src/editing/graphql-editing-service.ts#L101)

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### new GraphQLEditingService()

> **new GraphQLEditingService**(`serviceConfig`): [`GraphQLEditingService`](GraphQLEditingService.md)

Defined in: [packages/core/src/editing/graphql-editing-service.ts:108](https://github.com/Sitecore/xmc-jss-dev/blob/4e954baaff703857abef880e6218bead13dfe25d/packages/core/src/editing/graphql-editing-service.ts#L108)

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | `GraphQLEditingServiceConfig` | configuration |

#### Returns

[`GraphQLEditingService`](GraphQLEditingService.md)

## Properties

### serviceConfig

> **serviceConfig**: `GraphQLEditingServiceConfig`

Defined in: [packages/core/src/editing/graphql-editing-service.ts:108](https://github.com/Sitecore/xmc-jss-dev/blob/4e954baaff703857abef880e6218bead13dfe25d/packages/core/src/editing/graphql-editing-service.ts#L108)

configuration

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`__namedParameters`, `initDictionary`, `hasNext`, `after`?): `Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/editing/graphql-editing-service.ts:197](https://github.com/Sitecore/xmc-jss-dev/blob/4e954baaff703857abef880e6218bead13dfe25d/packages/core/src/editing/graphql-editing-service.ts#L197)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `__namedParameters` | \{ `language`: `string`; `siteName`: `string`; \} | `undefined` |
| `__namedParameters.language` | `string` | `undefined` |
| `__namedParameters.siteName` | `string` | `undefined` |
| `initDictionary` | `object`[] | `[]` |
| `hasNext`? | `boolean` | `true` |
| `after`? | `string` | `undefined` |

#### Returns

`Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

***

### fetchEditingData()

> **fetchEditingData**(`variables`): `Promise`\<\{ `dictionary`: [`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md); `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

Defined in: [packages/core/src/editing/graphql-editing-service.ts:122](https://github.com/Sitecore/xmc-jss-dev/blob/4e954baaff703857abef880e6218bead13dfe25d/packages/core/src/editing/graphql-editing-service.ts#L122)

Fetches editing data. Provides the layout data and dictionary phrases

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variables` | \{ `itemId`: `string`; `language`: `string`; `layoutKind`: [`LayoutKind`](../enumerations/LayoutKind.md); `siteName`: `string`; `version`: `string`; \} | The parameters for fetching editing data. |
| `variables.itemId` | `string` | The item id (path) to fetch layout data for. |
| `variables.language` | `string` | The language to fetch layout data for. |
| `variables.layoutKind`? | [`LayoutKind`](../enumerations/LayoutKind.md) | The final or shared layout variant. |
| `variables.siteName` | `string` | The site name. |
| `variables.version`? | `string` | The version of the item (optional). |

#### Returns

`Promise`\<\{ `dictionary`: [`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md); `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

The layout data and dictionary phrases.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/editing/graphql-editing-service.ts:240](https://github.com/Sitecore/xmc-jss-dev/blob/4e954baaff703857abef880e6218bead13dfe25d/packages/core/src/editing/graphql-editing-service.ts#L240)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
