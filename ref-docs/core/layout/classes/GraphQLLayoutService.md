[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / GraphQLLayoutService

# Class: GraphQLLayoutService

Defined in: [packages/core/src/layout/graphql-layout-service.ts:34](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/layout/graphql-layout-service.ts#L34)

Service that fetch layout data using Sitecore's GraphQL API.

## Mixes

GraphQLRequestClient

## Extends

- `LayoutServiceBase`

## Constructors

### new GraphQLLayoutService()

> **new GraphQLLayoutService**(`serviceConfig`): [`GraphQLLayoutService`](GraphQLLayoutService.md)

Defined in: [packages/core/src/layout/graphql-layout-service.ts:41](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/layout/graphql-layout-service.ts#L41)

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | [`GraphQLLayoutServiceConfig`](../type-aliases/GraphQLLayoutServiceConfig.md) | configuration |

#### Returns

[`GraphQLLayoutService`](GraphQLLayoutService.md)

#### Overrides

`LayoutServiceBase.constructor`

## Properties

### serviceConfig

> **serviceConfig**: [`GraphQLLayoutServiceConfig`](../type-aliases/GraphQLLayoutServiceConfig.md)

Defined in: [packages/core/src/layout/graphql-layout-service.ts:41](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/layout/graphql-layout-service.ts#L41)

configuration

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `language`?): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/layout/graphql-layout-service.ts:52](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/layout/graphql-layout-service.ts#L52)

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

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/layout/graphql-layout-service.ts:77](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/layout/graphql-layout-service.ts#L77)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getLayoutQuery()

> `protected` **getLayoutQuery**(`itemPath`, `language`?): `string`

Defined in: [packages/core/src/layout/graphql-layout-service.ts:95](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/layout/graphql-layout-service.ts#L95)

Returns GraphQL Layout query

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | page route |
| `language`? | `string` | language |

#### Returns

`string`

GraphQL query
