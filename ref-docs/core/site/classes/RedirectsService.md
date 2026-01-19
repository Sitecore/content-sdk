[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / RedirectsService

# Class: RedirectsService

Defined in: [packages/core/src/site/redirects-service.ts:84](https://github.com/Sitecore/content-sdk/blob/eba10ed6deebb652659e1f3e0c6d9ce0e19bb662/packages/core/src/site/redirects-service.ts#L84)

The RedirectsService class is used to query the Content SDK redirects using Graphql endpoint

## Constructors

### Constructor

> **new RedirectsService**(`options`): `RedirectsService`

Defined in: [packages/core/src/site/redirects-service.ts:92](https://github.com/Sitecore/content-sdk/blob/eba10ed6deebb652659e1f3e0c6d9ce0e19bb662/packages/core/src/site/redirects-service.ts#L92)

Creates an instance of graphQL redirects service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RedirectsServiceConfig`](../type-aliases/RedirectsServiceConfig.md) | instance |

#### Returns

`RedirectsService`

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/site/redirects-service.ts:97](https://github.com/Sitecore/content-sdk/blob/eba10ed6deebb652659e1f3e0c6d9ce0e19bb662/packages/core/src/site/redirects-service.ts#L97)

##### Returns

`string`

## Methods

### fetchRedirects()

> **fetchRedirects**(`siteName`, `fetchOptions?`): `Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Defined in: [packages/core/src/site/redirects-service.ts:108](https://github.com/Sitecore/content-sdk/blob/eba10ed6deebb652659e1f3e0c6d9ce0e19bb662/packages/core/src/site/redirects-service.ts#L108)

Fetch an array of redirects from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | site name |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Promise<RedirectInfo[]>

#### Throws

if the siteName is empty.

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`RedirectsQueryResult`](../type-aliases/RedirectsQueryResult.md)\>

Defined in: [packages/core/src/site/redirects-service.ts:152](https://github.com/Sitecore/content-sdk/blob/eba10ed6deebb652659e1f3e0c6d9ce0e19bb662/packages/core/src/site/redirects-service.ts#L152)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`RedirectsQueryResult`](../type-aliases/RedirectsQueryResult.md)\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/redirects-service.ts:136](https://github.com/Sitecore/content-sdk/blob/eba10ed6deebb652659e1f3e0c6d9ce0e19bb662/packages/core/src/site/redirects-service.ts#L136)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
