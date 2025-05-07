[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLSiteInfoServiceConfig

# Type Alias: GraphQLSiteInfoServiceConfig

> **GraphQLSiteInfoServiceConfig**: [`CacheOptions`](../../index/interfaces/CacheOptions.md) & `object`

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:19](https://github.com/Sitecore/content-sdk/blob/b60d4881ed47b9a004bc31855cb9a3fd1d4f6563/packages/core/src/site/graphql-siteinfo-service.ts#L19)

## Type declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### pageSize?

> `optional` **pageSize**: `number`

common variable for all GraphQL queries
it will be used for every type of query to regulate result batch size
Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.

#### Default

```ts
10
```
