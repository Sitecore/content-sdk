[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / GraphQLLayoutServiceConfig

# Type Alias: GraphQLLayoutServiceConfig

> **GraphQLLayoutServiceConfig**: `Pick`\<[`GraphQLRequestClientConfig`](../../index/type-aliases/GraphQLRequestClientConfig.md), `"retries"` \| `"retryStrategy"`\> & `Partial`\<[`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)\[`"layout"`\]\> & `object`

Defined in: [packages/core/src/layout/graphql-layout-service.ts:13](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/core/src/layout/graphql-layout-service.ts#L13)

## Type declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### siteName

> **siteName**: `string`

The JSS application name
