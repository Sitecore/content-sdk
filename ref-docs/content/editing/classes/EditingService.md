[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / EditingService

# Class: EditingService

Defined in: [content/src/editing/editing-service.ts:60](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/content/src/editing/editing-service.ts#L60)

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### Constructor

> **new EditingService**(`serviceConfig`): `EditingService`

Defined in: [content/src/editing/editing-service.ts:67](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/content/src/editing/editing-service.ts#L67)

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

Defined in: [content/src/editing/editing-service.ts:67](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/content/src/editing/editing-service.ts#L67)

configuration

## Methods

### fetchEditingData()

> **fetchEditingData**(`variables`, `fetchOptions?`): `Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

Defined in: [content/src/editing/editing-service.ts:84](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/content/src/editing/editing-service.ts#L84)

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

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/editing/editing-service.ts:141](https://github.com/Sitecore/content-sdk/blob/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e/packages/content/src/editing/editing-service.ts#L141)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation
