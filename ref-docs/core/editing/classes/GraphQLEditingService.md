[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / GraphQLEditingService

# Class: GraphQLEditingService

Defined in: [packages/core/src/editing/graphql-editing-service.ts:111](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/editing/graphql-editing-service.ts#L111)

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### new GraphQLEditingService()

> **new GraphQLEditingService**(`serviceConfig`): [`GraphQLEditingService`](GraphQLEditingService.md)

Defined in: [packages/core/src/editing/graphql-editing-service.ts:118](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/editing/graphql-editing-service.ts#L118)

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

Defined in: [packages/core/src/editing/graphql-editing-service.ts:118](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/editing/graphql-editing-service.ts#L118)

configuration

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`__namedParameters`, `fetchOptions`?): `Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/editing/graphql-editing-service.ts:208](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/editing/graphql-editing-service.ts#L208)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `after`: `string`; `hasNext`: `boolean`; `initDictionary`: `object`[]; `language`: `string`; `siteName`: `string`; \} |
| `__namedParameters.after`? | `string` |
| `__namedParameters.hasNext`? | `boolean` |
| `__namedParameters.initDictionary`? | `object`[] |
| `__namedParameters.language`? | `string` |
| `__namedParameters.siteName`? | `string` |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) |

#### Returns

`Promise`\<[`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md)\>

***

### fetchEditingData()

> **fetchEditingData**(`variables`, `fetchOptions`?): `Promise`\<\{ `dictionary`: [`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md); `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

Defined in: [packages/core/src/editing/graphql-editing-service.ts:134](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/editing/graphql-editing-service.ts#L134)

Fetches editing data. Provides the layout data and dictionary phrases

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variables` | `EditingOptions` | The parameters for fetching editing data. |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<\{ `dictionary`: [`DictionaryPhrases`](../../i18n/interfaces/DictionaryPhrases.md); `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

The layout data and dictionary phrases.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/editing/graphql-editing-service.ts:257](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/editing/graphql-editing-service.ts#L257)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
