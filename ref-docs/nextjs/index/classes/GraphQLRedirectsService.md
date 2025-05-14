[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLRedirectsService

# Class: GraphQLRedirectsService

Defined in: core/types/site/graphql-redirects-service.d.ts:38

The GraphQLRedirectsService class is used to query the JSS redirects using Graphql endpoint

## Constructors

### Constructor

> **new GraphQLRedirectsService**(`options`): `GraphQLRedirectsService`

Defined in: core/types/site/graphql-redirects-service.d.ts:46

Creates an instance of graphQL redirects service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GraphQLRedirectsServiceConfig`](../type-aliases/GraphQLRedirectsServiceConfig.md) | instance |

#### Returns

`GraphQLRedirectsService`

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: core/types/site/graphql-redirects-service.d.ts:47

##### Returns

`string`

## Methods

### fetchRedirects()

> **fetchRedirects**(`siteName`, `fetchOptions?`): `Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Defined in: core/types/site/graphql-redirects-service.d.ts:55

Fetch an array of redirects from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | site name |
| `fetchOptions?` | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Promise<RedirectInfo[]>

#### Throws

if the siteName is empty.

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../interfaces/CacheClient.md)\<`RedirectsQueryResult`\>

Defined in: core/types/site/graphql-redirects-service.d.ts:68

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../interfaces/CacheClient.md)\<`RedirectsQueryResult`\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/site/graphql-redirects-service.d.ts:62

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation
