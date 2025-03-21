[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLErrorPagesService

# Class: GraphQLErrorPagesService

Defined in: [packages/core/src/site/graphql-error-pages-service.ts:60](https://github.com/Sitecore/xmc-jss-dev/blob/3977926a625263337e3b7cdaaa92a610ea43e8f1/packages/core/src/site/graphql-error-pages-service.ts#L60)

Service that fetch the error pages data using Sitecore's GraphQL API.

## Constructors

### new GraphQLErrorPagesService()

> **new GraphQLErrorPagesService**(`options`): [`GraphQLErrorPagesService`](GraphQLErrorPagesService.md)

Defined in: [packages/core/src/site/graphql-error-pages-service.ts:67](https://github.com/Sitecore/xmc-jss-dev/blob/3977926a625263337e3b7cdaaa92a610ea43e8f1/packages/core/src/site/graphql-error-pages-service.ts#L67)

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

Defined in: [packages/core/src/site/graphql-error-pages-service.ts:67](https://github.com/Sitecore/xmc-jss-dev/blob/3977926a625263337e3b7cdaaa92a610ea43e8f1/packages/core/src/site/graphql-error-pages-service.ts#L67)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/site/graphql-error-pages-service.ts:71](https://github.com/Sitecore/xmc-jss-dev/blob/3977926a625263337e3b7cdaaa92a610ea43e8f1/packages/core/src/site/graphql-error-pages-service.ts#L71)

##### Returns

`string`

## Methods

### fetchErrorPages()

> **fetchErrorPages**(`siteName`, `locale`?, `fetchOptions`?): `Promise`\<`null` \| [`ErrorPages`](../type-aliases/ErrorPages.md)\>

Defined in: [packages/core/src/site/graphql-error-pages-service.ts:83](https://github.com/Sitecore/xmc-jss-dev/blob/3977926a625263337e3b7cdaaa92a610ea43e8f1/packages/core/src/site/graphql-error-pages-service.ts#L83)

Fetch list of error pages for the site

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | The site name |
| `locale`? | `string` | The language |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`null` \| [`ErrorPages`](../type-aliases/ErrorPages.md)\>

list of url's error pages

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-error-pages-service.ts:114](https://github.com/Sitecore/xmc-jss-dev/blob/3977926a625263337e3b7cdaaa92a610ea43e8f1/packages/core/src/site/graphql-error-pages-service.ts#L114)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
