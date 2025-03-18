[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / GraphQLEditingService

# Class: GraphQLEditingService

Defined in: core/types/editing/graphql-editing-service.d.ts:58

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### new GraphQLEditingService()

> **new GraphQLEditingService**(`serviceConfig`): [`GraphQLEditingService`](GraphQLEditingService.md)

Defined in: core/types/editing/graphql-editing-service.d.ts:65

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

Defined in: core/types/editing/graphql-editing-service.d.ts:59

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`__namedParameters`, `fetchOptions`?): `Promise`\<[`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md)\>

Defined in: core/types/editing/graphql-editing-service.d.ts:81

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `after`: `string`; `hasNext`: `boolean`; `initDictionary`: `object`[]; `language`: `string`; `siteName`: `string`; \} |
| `__namedParameters.after`? | `string` |
| `__namedParameters.hasNext`? | `boolean` |
| `__namedParameters.initDictionary`? | `object`[] |
| `__namedParameters.language`? | `string` |
| `__namedParameters.siteName`? | `string` |
| `fetchOptions`? | `FetchOptions` |

#### Returns

`Promise`\<[`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md)\>

***

### fetchEditingData()

> **fetchEditingData**(`variables`, `fetchOptions`?): `Promise`\<\{ `dictionary`: [`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md); `layoutData`: [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md); \}\>

Defined in: core/types/editing/graphql-editing-service.d.ts:77

Fetches editing data. Provides the layout data and dictionary phrases

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variables` | `EditingOptions` | The parameters for fetching editing data. |
| `fetchOptions`? | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<\{ `dictionary`: [`DictionaryPhrases`](../../index/interfaces/DictionaryPhrases.md); `layoutData`: [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md); \}\>

The layout data and dictionary phrases.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/editing/graphql-editing-service.d.ts:95

Gets a GraphQL client that can make requests to the API.

#### Returns

`GraphQLClient`

implementation
