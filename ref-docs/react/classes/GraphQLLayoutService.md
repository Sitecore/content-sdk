[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / GraphQLLayoutService

# Class: GraphQLLayoutService

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:31

Service that fetch layout data using Sitecore's GraphQL API.

## Mixes

GraphQLRequestClient

## Extends

- `LayoutServiceBase`

## Constructors

### new GraphQLLayoutService()

> **new GraphQLLayoutService**(`serviceConfig`): [`GraphQLLayoutService`](GraphQLLayoutService.md)

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:38

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | `GraphQLLayoutServiceConfig` | configuration |

#### Returns

[`GraphQLLayoutService`](GraphQLLayoutService.md)

#### Overrides

`LayoutServiceBase.constructor`

## Properties

### serviceConfig

> **serviceConfig**: `GraphQLLayoutServiceConfig`

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:32

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `language`?): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:45

Fetch layout data for an item.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | item path to fetch layout data for. |
| `language`? | `string` | the language to fetch layout data for. |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

layout service data

#### Overrides

`LayoutServiceBase.fetchLayoutData`

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:50

Gets a GraphQL client that can make requests to the API.

#### Returns

`GraphQLClient`

implementation

***

### getLayoutQuery()

> `protected` **getLayoutQuery**(`itemPath`, `language`?): `string`

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:57

Returns GraphQL Layout query

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | page route |
| `language`? | `string` | language |

#### Returns

`string`

GraphQL query
