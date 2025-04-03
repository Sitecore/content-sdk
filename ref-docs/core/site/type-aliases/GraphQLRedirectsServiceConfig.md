[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLRedirectsServiceConfig

# Type Alias: GraphQLRedirectsServiceConfig

> **GraphQLRedirectsServiceConfig**: [`CacheOptions`](../../index/interfaces/CacheOptions.md) & `object`

Defined in: [packages/core/src/site/graphql-redirects-service.ts:36](https://github.com/Sitecore/content-sdk/blob/41c13b52df868906ffa0d42b81d2e4d21033d6c3/packages/core/src/site/graphql-redirects-service.ts#L36)

## Type declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Override fetch method. Uses 'GraphQLRequestClient' default otherwise.
