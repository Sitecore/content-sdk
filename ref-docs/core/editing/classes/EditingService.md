[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / EditingService

# Class: EditingService

Defined in: [packages/core/src/editing/editing-service.ts:45](https://github.com/Sitecore/content-sdk/blob/6104efc507b9dca7ce977b97a32095c83116e73e/packages/core/src/editing/editing-service.ts#L45)

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### Constructor

> **new EditingService**(`serviceConfig`): `EditingService`

Defined in: [packages/core/src/editing/editing-service.ts:52](https://github.com/Sitecore/content-sdk/blob/6104efc507b9dca7ce977b97a32095c83116e73e/packages/core/src/editing/editing-service.ts#L52)

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

Defined in: [packages/core/src/editing/editing-service.ts:52](https://github.com/Sitecore/content-sdk/blob/6104efc507b9dca7ce977b97a32095c83116e73e/packages/core/src/editing/editing-service.ts#L52)

configuration

## Methods

### fetchEditingData()

> **fetchEditingData**(`variables`, `fetchOptions?`): `Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

Defined in: [packages/core/src/editing/editing-service.ts:67](https://github.com/Sitecore/content-sdk/blob/6104efc507b9dca7ce977b97a32095c83116e73e/packages/core/src/editing/editing-service.ts#L67)

Fetches editing data. Provides the layout data and dictionary phrases

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variables` | `EditingOptions` | The parameters for fetching editing data. |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

The layout data and dictionary phrases.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/editing/editing-service.ts:109](https://github.com/Sitecore/content-sdk/blob/6104efc507b9dca7ce977b97a32095c83116e73e/packages/core/src/editing/editing-service.ts#L109)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
