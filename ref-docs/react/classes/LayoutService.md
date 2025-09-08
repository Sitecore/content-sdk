[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / LayoutService

# Class: LayoutService

Defined in: packages/core/types/layout/layout-service.d.ts:12

Service that fetch layout data using Sitecore's GraphQL API.

## Mixes

GraphQLRequestClient

## Extends

- `SitecoreServiceBase`

## Constructors

### Constructor

> **new LayoutService**(`serviceConfig`): `LayoutService`

Defined in: packages/core/types/layout/layout-service.d.ts:18

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | `LayoutServiceConfig` | configuration |

#### Returns

`LayoutService`

#### Overrides

`SitecoreServiceBase.constructor`

## Properties

### graphQLClient

> `protected` **graphQLClient**: `GraphQLClient`

Defined in: packages/core/types/sitecore-service-base.d.ts:19

#### Inherited from

`SitecoreServiceBase.graphQLClient`

***

### serviceConfig

> **serviceConfig**: `LayoutServiceConfig`

Defined in: packages/core/types/layout/layout-service.d.ts:13

#### Overrides

`SitecoreServiceBase.serviceConfig`

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `routeOptions?`, `fetchOptions?`): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: packages/core/types/layout/layout-service.d.ts:26

Fetch layout data for an item.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | item path to fetch layout data for. |
| `routeOptions?` | `RouteOptions` | Request options like language and site to retrieve data for |
| `fetchOptions?` | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

layout service data

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: packages/core/types/sitecore-service-base.d.ts:29

Gets a GraphQL client that can make requests to the API.

#### Returns

`GraphQLClient`

implementation

#### Inherited from

`SitecoreServiceBase.getGraphQLClient`

***

### getLayoutQuery()

> `protected` **getLayoutQuery**(`itemPath`, `site?`, `language?`): `string`

Defined in: packages/core/types/layout/layout-service.d.ts:34

Returns GraphQL Layout query

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | page route |
| `site?` | `string` | site name |
| `language?` | `string` | language |

#### Returns

`string`

GraphQL query
