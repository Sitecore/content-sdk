[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / RedirectsService

# Class: RedirectsService

Defined in: [content/src/site/redirects-service.ts:89](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/content/src/site/redirects-service.ts#L89)

The RedirectsService class is used to query the Content SDK redirects using Graphql endpoint

## Constructors

### Constructor

> **new RedirectsService**(`options`): `RedirectsService`

Defined in: [content/src/site/redirects-service.ts:97](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/content/src/site/redirects-service.ts#L97)

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

Defined in: [content/src/site/redirects-service.ts:102](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/content/src/site/redirects-service.ts#L102)

##### Returns

`string`

## Methods

### fetchRedirects()

> **fetchRedirects**(`siteName`, `fetchOptions?`): `Promise`\<[`RedirectInfo`](../type-aliases/RedirectInfo.md)[]\>

Defined in: [content/src/site/redirects-service.ts:113](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/content/src/site/redirects-service.ts#L113)

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

> `protected` **getCacheClient**(): `CacheClient`\<[`RedirectsQueryResult`](../type-aliases/RedirectsQueryResult.md)\>

Defined in: [content/src/site/redirects-service.ts:157](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/content/src/site/redirects-service.ts#L157)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

`CacheClient`\<[`RedirectsQueryResult`](../type-aliases/RedirectsQueryResult.md)\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/redirects-service.ts:141](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/content/src/site/redirects-service.ts#L141)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation
