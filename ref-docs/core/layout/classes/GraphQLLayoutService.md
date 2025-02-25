[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / GraphQLLayoutService

# Class: GraphQLLayoutService

Defined in: [packages/core/src/layout/graphql-layout-service.ts:40](https://github.com/Sitecore/xmc-jss-dev/blob/9249852e679f8a82eeff2dd39bb5b46c85431c25/packages/core/src/layout/graphql-layout-service.ts#L40)

Service that fetch layout data using Sitecore's GraphQL API.

## Mixes

GraphQLRequestClient

## Extends

- `LayoutServiceBase`

## Constructors

### new GraphQLLayoutService()

> **new GraphQLLayoutService**(`serviceConfig`): [`GraphQLLayoutService`](GraphQLLayoutService.md)

Defined in: [packages/core/src/layout/graphql-layout-service.ts:47](https://github.com/Sitecore/xmc-jss-dev/blob/9249852e679f8a82eeff2dd39bb5b46c85431c25/packages/core/src/layout/graphql-layout-service.ts#L47)

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | [`GraphQLLayoutServiceConfig`](../interfaces/GraphQLLayoutServiceConfig.md) | configuration |

#### Returns

[`GraphQLLayoutService`](GraphQLLayoutService.md)

#### Overrides

`LayoutServiceBase.constructor`

## Properties

### serviceConfig

> **serviceConfig**: [`GraphQLLayoutServiceConfig`](../interfaces/GraphQLLayoutServiceConfig.md)

Defined in: [packages/core/src/layout/graphql-layout-service.ts:47](https://github.com/Sitecore/xmc-jss-dev/blob/9249852e679f8a82eeff2dd39bb5b46c85431c25/packages/core/src/layout/graphql-layout-service.ts#L47)

configuration

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `language`?): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/layout/graphql-layout-service.ts:58](https://github.com/Sitecore/xmc-jss-dev/blob/9249852e679f8a82eeff2dd39bb5b46c85431c25/packages/core/src/layout/graphql-layout-service.ts#L58)

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

Defined in: [packages/core/src/layout/graphql-layout-service.ts:83](https://github.com/Sitecore/xmc-jss-dev/blob/9249852e679f8a82eeff2dd39bb5b46c85431c25/packages/core/src/layout/graphql-layout-service.ts#L83)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getLayoutQuery()

> `protected` **getLayoutQuery**(`itemPath`, `language`?): `string`

Defined in: [packages/core/src/layout/graphql-layout-service.ts:101](https://github.com/Sitecore/xmc-jss-dev/blob/9249852e679f8a82eeff2dd39bb5b46c85431c25/packages/core/src/layout/graphql-layout-service.ts#L101)

Returns GraphQL Layout query

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | page route |
| `language`? | `string` | language |

#### Returns

`string`

GraphQL query
