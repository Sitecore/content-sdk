[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / EditingService

# Class: EditingService

Defined in: [content/src/editing/editing-service.ts:61](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/editing-service.ts#L61)

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### Constructor

> **new EditingService**(`serviceConfig`): `EditingService`

Defined in: [content/src/editing/editing-service.ts:68](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/editing-service.ts#L68)

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

Defined in: [content/src/editing/editing-service.ts:68](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/editing-service.ts#L68)

configuration

## Methods

### fetchEditingData()

> **fetchEditingData**(`variables`, `fetchOptions?`): `Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

Defined in: [content/src/editing/editing-service.ts:86](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/editing-service.ts#L86)

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

Defined in: [content/src/editing/editing-service.ts:145](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/editing-service.ts#L145)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation
