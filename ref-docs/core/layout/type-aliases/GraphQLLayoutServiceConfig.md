[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / GraphQLLayoutServiceConfig

# Type Alias: GraphQLLayoutServiceConfig

> **GraphQLLayoutServiceConfig**: `Pick`\<[`GraphQLRequestClientConfig`](../../index/type-aliases/GraphQLRequestClientConfig.md), `"retries"` \| `"retryStrategy"`\> & `Partial`\<[`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)\[`"layout"`\]\> & `object`

Defined in: [packages/core/src/layout/graphql-layout-service.ts:13](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/layout/graphql-layout-service.ts#L13)

## Type declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### siteName

> **siteName**: `string`

The JSS application name
