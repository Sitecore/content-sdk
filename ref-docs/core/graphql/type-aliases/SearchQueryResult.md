[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [graphql](../README.md) / SearchQueryResult

# Type Alias: SearchQueryResult\<T\>

> **SearchQueryResult**\<`T`\>: `object`

Defined in: [packages/core/src/graphql/search-service.ts:22](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/graphql/search-service.ts#L22)

Schema of data returned in response to a "search" query request

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of objects being requested. |

## Type declaration

### search

> **search**: `object`

#### search.pageInfo

> **pageInfo**: [`PageInfo`](../interfaces/PageInfo.md)

Data needed to paginate the search results

#### search.results

> **results**: `T`[]
