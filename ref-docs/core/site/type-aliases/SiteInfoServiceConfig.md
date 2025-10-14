[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SiteInfoServiceConfig

# Type Alias: SiteInfoServiceConfig

> **SiteInfoServiceConfig** = [`CacheOptions`](../../index/interfaces/CacheOptions.md) & `object`

Defined in: [packages/core/src/site/siteinfo-service.ts:19](https://github.com/Sitecore/content-sdk/blob/37b030678b27071e2e67e8eb187235e51935f3ce/packages/core/src/site/siteinfo-service.ts#L19)

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
