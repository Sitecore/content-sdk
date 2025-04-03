[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLRedirectsService

# Class: GraphQLRedirectsService

Defined in: [packages/core/src/site/graphql-redirects-service.ts:58](https://github.com/Sitecore/content-sdk/blob/41c13b52df868906ffa0d42b81d2e4d21033d6c3/packages/core/src/site/graphql-redirects-service.ts#L58)

The GraphQLRedirectsService class is used to query the JSS redirects using Graphql endpoint

## Constructors

### new GraphQLRedirectsService()

> **new GraphQLRedirectsService**(`options`): [`GraphQLRedirectsService`](GraphQLRedirectsService.md)

Defined in: [packages/core/src/site/graphql-redirects-service.ts:66](https://github.com/Sitecore/content-sdk/blob/41c13b52df868906ffa0d42b81d2e4d21033d6c3/packages/core/src/site/graphql-redirects-service.ts#L66)

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

Defined in: [packages/core/src/site/graphql-redirects-service.ts:71](https://github.com/Sitecore/content-sdk/blob/41c13b52df868906ffa0d42b81d2e4d21033d6c3/packages/core/src/site/graphql-redirects-service.ts#L71)

##### Returns

`string`

## Methods

### fetchRedirects()

> **fetchRedirects**(`siteName`, `fetchOptions`?): `Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-redirects-service.ts:82](https://github.com/Sitecore/content-sdk/blob/41c13b52df868906ffa0d42b81d2e4d21033d6c3/packages/core/src/site/graphql-redirects-service.ts#L82)

Fetch an array of redirects from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | site name |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Promise<RedirectInfo[]>

#### Throws

if the siteName is empty.

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`RedirectsQueryResult`](../type-aliases/RedirectsQueryResult.md)\>

Defined in: [packages/core/src/site/graphql-redirects-service.ts:126](https://github.com/Sitecore/content-sdk/blob/41c13b52df868906ffa0d42b81d2e4d21033d6c3/packages/core/src/site/graphql-redirects-service.ts#L126)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`RedirectsQueryResult`](../type-aliases/RedirectsQueryResult.md)\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-redirects-service.ts:110](https://github.com/Sitecore/content-sdk/blob/41c13b52df868906ffa0d42b81d2e4d21033d6c3/packages/core/src/site/graphql-redirects-service.ts#L110)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
