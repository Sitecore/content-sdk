[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / RedirectsServiceConfig

# Type Alias: RedirectsServiceConfig

> **RedirectsServiceConfig** = `CacheOptions` & `object`

Defined in: [content/src/site/redirects-service.ts:67](https://github.com/Sitecore/content-sdk/blob/f559a5f32d3b72c553bf5e9a3870c6af89ad15ac/packages/content/src/site/redirects-service.ts#L67)

Configuration for

## Type Declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### fetch?

> `optional` **fetch?**: *typeof* `fetch`

Override fetch method. Uses 'GraphQLRequestClient' default otherwise.

## See

RedirectsService instances
