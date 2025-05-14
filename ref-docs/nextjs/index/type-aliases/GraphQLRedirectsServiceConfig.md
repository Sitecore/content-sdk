[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLRedirectsServiceConfig

# Type Alias: GraphQLRedirectsServiceConfig

> **GraphQLRedirectsServiceConfig** = [`CacheOptions`](../interfaces/CacheOptions.md) & `object`

Defined in: core/types/site/graphql-redirects-service.d.ts:14

## Type declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Override fetch method. Uses 'GraphQLRequestClient' default otherwise.
