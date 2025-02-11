[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLRobotsService

# Class: GraphQLRobotsService

Defined in: core/types/site/graphql-robots-service.d.ts:27

Service that fetch the robots.txt data using Sitecore's GraphQL API.

## Constructors

### new GraphQLRobotsService()

> **new GraphQLRobotsService**(`options`): [`GraphQLRobotsService`](GraphQLRobotsService.md)

Defined in: core/types/site/graphql-robots-service.d.ts:34

Creates an instance of graphQL robots.txt service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GraphQLRobotsServiceConfig`](../type-aliases/GraphQLRobotsServiceConfig.md) | instance |

#### Returns

[`GraphQLRobotsService`](GraphQLRobotsService.md)

## Properties

### options

> **options**: [`GraphQLRobotsServiceConfig`](../type-aliases/GraphQLRobotsServiceConfig.md)

Defined in: core/types/site/graphql-robots-service.d.ts:28

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: core/types/site/graphql-robots-service.d.ts:35

##### Returns

`string`

## Methods

### fetchRobots()

> **fetchRobots**(): `Promise`\<`string`\>

Defined in: core/types/site/graphql-robots-service.d.ts:41

Fetch a data of robots.txt from API

#### Returns

`Promise`\<`string`\>

text of robots.txt

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/site/graphql-robots-service.d.ts:48

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation
