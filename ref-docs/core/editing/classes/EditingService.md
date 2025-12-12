[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / EditingService

# Class: EditingService

Defined in: [packages/core/src/editing/editing-service.ts:54](https://github.com/Sitecore/content-sdk/blob/7aac741918fcea8b66b74d1b742cf4a79d490c91/packages/core/src/editing/editing-service.ts#L54)

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### Constructor

> **new EditingService**(`serviceConfig`): `EditingService`

Defined in: [packages/core/src/editing/editing-service.ts:61](https://github.com/Sitecore/content-sdk/blob/7aac741918fcea8b66b74d1b742cf4a79d490c91/packages/core/src/editing/editing-service.ts#L61)

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | [`EditingServiceConfig`](../interfaces/EditingServiceConfig.md) | configuration |

#### Returns

`EditingService`

## Properties

### serviceConfig

> **serviceConfig**: [`EditingServiceConfig`](../interfaces/EditingServiceConfig.md)

Defined in: [packages/core/src/editing/editing-service.ts:61](https://github.com/Sitecore/content-sdk/blob/7aac741918fcea8b66b74d1b742cf4a79d490c91/packages/core/src/editing/editing-service.ts#L61)

configuration

## Methods

### fetchEditingData()

> **fetchEditingData**(`variables`, `fetchOptions?`): `Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

Defined in: [packages/core/src/editing/editing-service.ts:76](https://github.com/Sitecore/content-sdk/blob/7aac741918fcea8b66b74d1b742cf4a79d490c91/packages/core/src/editing/editing-service.ts#L76)

Fetches editing data. Provides the layout data and dictionary phrases

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variables` | [`EditingOptions`](../type-aliases/EditingOptions.md) | The parameters for fetching editing data. |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

The layout data and dictionary phrases.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/editing/editing-service.ts:118](https://github.com/Sitecore/content-sdk/blob/7aac741918fcea8b66b74d1b742cf4a79d490c91/packages/core/src/editing/editing-service.ts#L118)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
