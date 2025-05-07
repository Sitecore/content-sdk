[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / GraphQLLayoutService

# Class: GraphQLLayoutService

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:13

Service that fetch layout data using Sitecore's GraphQL API.

## Mixes

GraphQLRequestClient

## Extends

- `LayoutServiceBase`

## Constructors

### new GraphQLLayoutService()

> **new GraphQLLayoutService**(`serviceConfig`): [`GraphQLLayoutService`](GraphQLLayoutService.md)

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:19

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

### graphQLClient

> `protected` **graphQLClient**: `GraphQLClient`

Defined in: packages/core/types/sitecore-service-base.d.ts:19

#### Inherited from

`LayoutServiceBase.graphQLClient`

***

### serviceConfig

> **serviceConfig**: `GraphQLLayoutServiceConfig`

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:14

#### Overrides

`LayoutServiceBase.serviceConfig`

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `routeOptions`?, `fetchOptions`?): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:27

Fetch layout data for an item.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | item path to fetch layout data for. |
| `routeOptions`? | `RouteOptions` | Request options like language and site to retrieve data for |
| `fetchOptions`? | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

layout service data

#### Overrides

`LayoutServiceBase.fetchLayoutData`

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: packages/core/types/sitecore-service-base.d.ts:29

Gets a GraphQL client that can make requests to the API.

#### Returns

`GraphQLClient`

implementation

#### Inherited from

`LayoutServiceBase.getGraphQLClient`

***

### getLayoutQuery()

> `protected` **getLayoutQuery**(`itemPath`, `site`?, `language`?): `string`

Defined in: packages/core/types/layout/graphql-layout-service.d.ts:35

Returns GraphQL Layout query

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | page route |
| `site`? | `string` | site name |
| `language`? | `string` | language |

#### Returns

`string`

GraphQL query
