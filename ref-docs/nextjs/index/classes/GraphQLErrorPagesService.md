[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLErrorPagesService

# Class: GraphQLErrorPagesService

Defined in: core/types/site/graphql-error-pages-service.d.ts:32

Service that fetch the error pages data using Sitecore's GraphQL API.

## Constructors

### new GraphQLErrorPagesService()

> **new GraphQLErrorPagesService**(`options`): [`GraphQLErrorPagesService`](GraphQLErrorPagesService.md)

Defined in: core/types/site/graphql-error-pages-service.d.ts:39

Creates an instance of graphQL error pages service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GraphQLErrorPagesServiceConfig`](../interfaces/GraphQLErrorPagesServiceConfig.md) | instance |

#### Returns

[`GraphQLErrorPagesService`](GraphQLErrorPagesService.md)

## Properties

### options

> **options**: [`GraphQLErrorPagesServiceConfig`](../interfaces/GraphQLErrorPagesServiceConfig.md)

Defined in: core/types/site/graphql-error-pages-service.d.ts:33

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: core/types/site/graphql-error-pages-service.d.ts:40

##### Returns

`string`

## Methods

### fetchErrorPages()

> **fetchErrorPages**(`siteName`, `locale`?, `fetchOptions`?): `Promise`\<`null` \| [`ErrorPages`](../type-aliases/ErrorPages.md)\>

Defined in: core/types/site/graphql-error-pages-service.d.ts:49

Fetch list of error pages for the site

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | The site name |
| `locale`? | `string` | The language |
| `fetchOptions`? | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`null` \| [`ErrorPages`](../type-aliases/ErrorPages.md)\>

list of url's error pages

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/site/graphql-error-pages-service.d.ts:56

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation
