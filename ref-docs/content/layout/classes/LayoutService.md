[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / LayoutService

# Class: LayoutService

Defined in: [content/src/layout/layout-service.ts:25](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/content/src/layout/layout-service.ts#L25)

Service that fetch layout data using Sitecore's GraphQL API.

## Mixes

GraphQLRequestClient

## Extends

- `SitecoreServiceBase`

## Constructors

### Constructor

> **new LayoutService**(`serviceConfig`): `LayoutService`

Defined in: [content/src/layout/layout-service.ts:30](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/content/src/layout/layout-service.ts#L30)

Fetch layout data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serviceConfig` | `Pick`\<[`SitecoreConfigInput`](../../config/type-aliases/SitecoreConfigInput.md), `"retries"`\> & `object` & `Partial`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`; \}\> | configuration |

#### Returns

`LayoutService`

#### Overrides

`SitecoreServiceBase.constructor`

## Properties

### graphQLClient

> `protected` **graphQLClient**: [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/sitecore-service-base.ts:20](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/content/src/sitecore-service-base.ts#L20)

#### Inherited from

`SitecoreServiceBase.graphQLClient`

***

### serviceConfig

> **serviceConfig**: `Pick`\<[`SitecoreConfigInput`](../../config/type-aliases/SitecoreConfigInput.md), `"retries"`\> & `object` & `Partial`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`; \}\>

Defined in: [content/src/layout/layout-service.ts:30](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/content/src/layout/layout-service.ts#L30)

configuration

#### Type Declaration

##### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

##### debugger?

> `optional` **debugger**: `Debugger`

Optional debug logger override

#### Inherited from

`SitecoreServiceBase.serviceConfig`

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `routeOptions?`, `fetchOptions?`): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: [content/src/layout/layout-service.ts:41](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/content/src/layout/layout-service.ts#L41)

Fetch layout data for an item.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | item path to fetch layout data for. |
| `routeOptions?` | [`RouteOptions`](../type-aliases/RouteOptions.md) | Request options like language and site to retrieve data for |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

layout service data

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/sitecore-service-base.ts:34](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/content/src/sitecore-service-base.ts#L34)

Gets a GraphQL client that can make requests to the API.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation

#### Inherited from

`SitecoreServiceBase.getGraphQLClient`

***

### getLayoutQuery()

> `protected` **getLayoutQuery**(`itemPath`, `site?`, `language?`): `string`

Defined in: [content/src/layout/layout-service.ts:69](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/content/src/layout/layout-service.ts#L69)

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
