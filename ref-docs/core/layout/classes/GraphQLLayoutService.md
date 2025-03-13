[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / GraphQLLayoutService

# Class: GraphQLLayoutService

Defined in: [packages/core/src/layout/graphql-layout-service.ts:17](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/layout/graphql-layout-service.ts#L17)

Service that fetch layout data using Sitecore's GraphQL API.

## Mixes

GraphQLRequestClient

## Extends

- `LayoutServiceBase`

## Constructors

### new GraphQLLayoutService()

> **new GraphQLLayoutService**(`serviceConfig`): [`GraphQLLayoutService`](GraphQLLayoutService.md)

Defined in: [packages/core/src/layout/graphql-layout-service.ts:22](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/layout/graphql-layout-service.ts#L22)

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | `Pick`\<[`SitecoreConfigInput`](../../config/type-aliases/SitecoreConfigInput.md), `"retries"`\> & `object` & `Partial`\<\{ `formatLayoutQuery`: `null` \| (`siteName`, `itemPath`, `locale`?) => `string`; \}\> | configuration |

#### Returns

[`GraphQLLayoutService`](GraphQLLayoutService.md)

#### Overrides

`LayoutServiceBase.constructor`

## Properties

### graphQLClient

> `protected` **graphQLClient**: [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/sitecore-service-base.ts:21](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/sitecore-service-base.ts#L21)

#### Inherited from

`LayoutServiceBase.graphQLClient`

***

### serviceConfig

> **serviceConfig**: `Pick`\<[`SitecoreConfigInput`](../../config/type-aliases/SitecoreConfigInput.md), `"retries"`\> & `object` & `Partial`\<\{ `formatLayoutQuery`: `null` \| (`siteName`, `itemPath`, `locale`?) => `string`; \}\>

Defined in: [packages/core/src/layout/graphql-layout-service.ts:22](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/layout/graphql-layout-service.ts#L22)

configuration

#### Type declaration

##### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

##### debugger?

> `optional` **debugger**: `Debugger`

Optional debug logger override

#### Inherited from

`LayoutServiceBase.serviceConfig`

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `routeOptions`?, `fetchOptions`?): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/layout/graphql-layout-service.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/layout/graphql-layout-service.ts#L33)

Fetch layout data for an item.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | item path to fetch layout data for. |
| `routeOptions`? | [`RouteOptions`](../type-aliases/RouteOptions.md) | Request options like language and site to retrieve data for |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

layout service data

#### Overrides

`LayoutServiceBase.fetchLayoutData`

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/sitecore-service-base.ts:35](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/sitecore-service-base.ts#L35)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

#### Inherited from

`LayoutServiceBase.getGraphQLClient`

***

### getLayoutQuery()

> `protected` **getLayoutQuery**(`itemPath`, `site`?, `language`?): `string`

Defined in: [packages/core/src/layout/graphql-layout-service.ts:60](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/layout/graphql-layout-service.ts#L60)

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
