[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / LayoutService

# Class: LayoutService

Defined in: core/types/layout/layout-service.d.ts:21

Service that fetch layout data using Sitecore's GraphQL API.

## Mixes

GraphQLRequestClient

## Extends

- `SitecoreServiceBase`

## Constructors

### Constructor

> **new LayoutService**(`serviceConfig`): `LayoutService`

Defined in: core/types/layout/layout-service.d.ts:27

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | `Pick`\<`SitecoreConfigInput`, `"retries"`\> & `object` & `Partial`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`; \}\> | configuration |

#### Returns

`LayoutService`

#### Overrides

`SitecoreServiceBase.constructor`

## Properties

### graphQLClient

> `protected` **graphQLClient**: `GraphQLClient`

Defined in: core/types/sitecore-service-base.d.ts:19

#### Inherited from

`SitecoreServiceBase.graphQLClient`

***

### serviceConfig

> **serviceConfig**: `Pick`\<`SitecoreConfigInput`, `"retries"`\> & `object` & `Partial`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`; \}\>

Defined in: core/types/layout/layout-service.d.ts:22

#### Type Declaration

##### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

##### debugger?

> `optional` **debugger**: `Debugger`

Optional debug logger override

#### Overrides

`SitecoreServiceBase.serviceConfig`

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `routeOptions?`, `fetchOptions?`): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: core/types/layout/layout-service.d.ts:35

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

Defined in: core/types/sitecore-service-base.d.ts:29

Gets a GraphQL client that can make requests to the API.

#### Returns

`GraphQLClient`

implementation

#### Inherited from

`SitecoreServiceBase.getGraphQLClient`

***

### getLayoutQuery()

> `protected` **getLayoutQuery**(`itemPath`, `site?`, `language?`): `string`

Defined in: core/types/layout/layout-service.d.ts:43

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
