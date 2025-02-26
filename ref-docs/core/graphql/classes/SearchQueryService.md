[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [graphql](../README.md) / SearchQueryService

# Class: ~~SearchQueryService\<T\>~~

Defined in: [packages/core/src/graphql/search-service.ts:87](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/graphql/search-service.ts#L87)

## Deprecated

use GraphQLClient instead
Provides functionality for performing GraphQL 'search' operations, including handling pagination.
This class is meant to be extended or used as a mixin; it's not meant to be used directly.

## Mixin

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of objects being requested. |

## Constructors

### new SearchQueryService()

> **new SearchQueryService**\<`T`\>(`client`): [`SearchQueryService`](SearchQueryService.md)\<`T`\>

Defined in: [packages/core/src/graphql/search-service.ts:92](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/graphql/search-service.ts#L92)

Creates an instance of search query service.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | [`GraphQLClient`](../../index/interfaces/GraphQLClient.md) | that fetches data from a GraphQL endpoint. |

#### Returns

[`SearchQueryService`](SearchQueryService.md)\<`T`\>

## Properties

### ~~client~~

> `protected` **client**: [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/graphql/search-service.ts:92](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/graphql/search-service.ts#L92)

that fetches data from a GraphQL endpoint.

## Methods

### ~~fetch()~~

> **fetch**(`query`, `args`): `Promise`\<`T`[]\>

Defined in: [packages/core/src/graphql/search-service.ts:105](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/graphql/search-service.ts#L105)

1. Validates mandatory search query arguments
2. Executes search query with pagination
3. Aggregates pagination results into a single result-set.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `string` \| `DocumentNode` | the search query. |
| `args` | [`SearchQueryVariables`](../interfaces/SearchQueryVariables.md) | search query arguments. |

#### Returns

`Promise`\<`T`[]\>

array of result objects.

#### Throws

if a valid root item ID is not provided.

#### Throws

if the provided language(s) is(are) not valid.
