[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLRedirectsService

# Class: GraphQLRedirectsService

Defined in: [packages/core/src/site/graphql-redirects-service.ts:58](https://github.com/Sitecore/xmc-jss-dev/blob/6619215c196ddf4b0e5218da4ae20a7b80c4f154/packages/core/src/site/graphql-redirects-service.ts#L58)

The GraphQLRedirectsService class is used to query the JSS redirects using Graphql endpoint

## Constructors

### new GraphQLRedirectsService()

> **new GraphQLRedirectsService**(`options`): [`GraphQLRedirectsService`](GraphQLRedirectsService.md)

Defined in: [packages/core/src/site/graphql-redirects-service.ts:66](https://github.com/Sitecore/xmc-jss-dev/blob/6619215c196ddf4b0e5218da4ae20a7b80c4f154/packages/core/src/site/graphql-redirects-service.ts#L66)

Creates an instance of graphQL redirects service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GraphQLRedirectsServiceConfig`](../type-aliases/GraphQLRedirectsServiceConfig.md) | instance |

#### Returns

[`GraphQLRedirectsService`](GraphQLRedirectsService.md)

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/site/graphql-redirects-service.ts:71](https://github.com/Sitecore/xmc-jss-dev/blob/6619215c196ddf4b0e5218da4ae20a7b80c4f154/packages/core/src/site/graphql-redirects-service.ts#L71)

##### Returns

`string`

## Methods

### fetchRedirects()

> **fetchRedirects**(`siteName`): `Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-redirects-service.ts:81](https://github.com/Sitecore/xmc-jss-dev/blob/6619215c196ddf4b0e5218da4ae20a7b80c4f154/packages/core/src/site/graphql-redirects-service.ts#L81)

Fetch an array of redirects from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | site name |

#### Returns

`Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Promise<RedirectInfo[]>

#### Throws

if the siteName is empty.

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`RedirectsQueryResult`](../type-aliases/RedirectsQueryResult.md)\>

Defined in: [packages/core/src/site/graphql-redirects-service.ts:121](https://github.com/Sitecore/xmc-jss-dev/blob/6619215c196ddf4b0e5218da4ae20a7b80c4f154/packages/core/src/site/graphql-redirects-service.ts#L121)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`RedirectsQueryResult`](../type-aliases/RedirectsQueryResult.md)\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-redirects-service.ts:105](https://github.com/Sitecore/xmc-jss-dev/blob/6619215c196ddf4b0e5218da4ae20a7b80c4f154/packages/core/src/site/graphql-redirects-service.ts#L105)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
