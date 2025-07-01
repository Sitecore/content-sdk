[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / RobotsService

# Class: RobotsService

Defined in: core/types/site/robots-service.d.ts:27

Service that fetch the robots.txt data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new RobotsService**(`options`): `RobotsService`

Defined in: core/types/site/robots-service.d.ts:34

Creates an instance of graphQL robots.txt service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RobotsServiceConfig`](../type-aliases/RobotsServiceConfig.md) | instance |

#### Returns

`RobotsService`

## Properties

### options

> **options**: [`RobotsServiceConfig`](../type-aliases/RobotsServiceConfig.md)

Defined in: core/types/site/robots-service.d.ts:28

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: core/types/site/robots-service.d.ts:35

##### Returns

`string`

## Methods

### fetchRobots()

> **fetchRobots**(`fetchOptions?`): `Promise`\<`string`\>

Defined in: core/types/site/robots-service.d.ts:42

Fetch a data of robots.txt from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions?` | `FetchOptions` | The fetch options to be used for the request. |

#### Returns

`Promise`\<`string`\>

text of robots.txt

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/site/robots-service.d.ts:49

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation
