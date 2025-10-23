[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / RobotsService

# Class: RobotsService

Defined in: [packages/core/src/site/robots-service.ts:37](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/core/src/site/robots-service.ts#L37)

Service that fetch the robots.txt data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new RobotsService**(`options`): `RobotsService`

Defined in: [packages/core/src/site/robots-service.ts:44](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/core/src/site/robots-service.ts#L44)

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

Defined in: [packages/core/src/site/robots-service.ts:44](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/core/src/site/robots-service.ts#L44)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/site/robots-service.ts:48](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/core/src/site/robots-service.ts#L48)

##### Returns

`string`

## Methods

### fetchRobots()

> **fetchRobots**(`fetchOptions?`): `Promise`\<`string`\>

Defined in: [packages/core/src/site/robots-service.ts:58](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/core/src/site/robots-service.ts#L58)

Fetch a data of robots.txt from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | The fetch options to be used for the request. |

#### Returns

`Promise`\<`string`\>

text of robots.txt

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/robots-service.ts:87](https://github.com/Sitecore/content-sdk/blob/62f7ac36d5480ae38ab5b264795c674f9e05e2d3/packages/core/src/site/robots-service.ts#L87)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
