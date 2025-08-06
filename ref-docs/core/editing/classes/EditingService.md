[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / EditingService

# Class: EditingService

<<<<<<< HEAD
Defined in: [packages/core/src/editing/editing-service.ts:45](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/editing-service.ts#L45)
=======
Defined in: [packages/core/src/editing/editing-service.ts:45](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/editing-service.ts#L45)
>>>>>>> dd686bb50 (Update API docs)

Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.

## Constructors

### Constructor

> **new EditingService**(`serviceConfig`): `EditingService`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/editing-service.ts:52](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/editing-service.ts#L52)
=======
Defined in: [packages/core/src/editing/editing-service.ts:52](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/editing-service.ts#L52)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/editing/editing-service.ts:52](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/editing-service.ts#L52)
=======
Defined in: [packages/core/src/editing/editing-service.ts:52](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/editing-service.ts#L52)
>>>>>>> dd686bb50 (Update API docs)

configuration

## Methods

### fetchEditingData()

> **fetchEditingData**(`variables`, `fetchOptions?`): `Promise`\<\{ `layoutData`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \}\>

<<<<<<< HEAD
Defined in: [packages/core/src/editing/editing-service.ts:67](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/editing-service.ts#L67)
=======
Defined in: [packages/core/src/editing/editing-service.ts:67](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/editing-service.ts#L67)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/editing/editing-service.ts:109](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/editing-service.ts#L109)
=======
Defined in: [packages/core/src/editing/editing-service.ts:109](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/editing-service.ts#L109)
>>>>>>> dd686bb50 (Update API docs)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
