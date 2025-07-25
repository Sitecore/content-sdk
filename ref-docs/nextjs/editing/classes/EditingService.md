[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingService

# Class: EditingService

Defined in: core/types/editing/editing-service.d.ts:35

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### Constructor

> **new EditingService**(`serviceConfig`): `EditingService`

Defined in: core/types/editing/editing-service.d.ts:42

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | `EditingServiceConfig` | configuration |

#### Returns

`EditingService`

## Properties

### serviceConfig

> **serviceConfig**: `EditingServiceConfig`

Defined in: core/types/editing/editing-service.d.ts:36

## Methods

### fetchEditingData()

> **fetchEditingData**(`variables`, `fetchOptions?`): `Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md); \}\>

Defined in: core/types/editing/editing-service.d.ts:54

Fetches editing data. Provides the layout data and dictionary phrases

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variables` | `EditingOptions` | The parameters for fetching editing data. |
| `fetchOptions?` | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../index/interfaces/LayoutServiceData.md); \}\>

The layout data and dictionary phrases.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/editing/editing-service.d.ts:61

Gets a GraphQL client that can make requests to the API.

#### Returns

`GraphQLClient`

implementation
