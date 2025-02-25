[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLLayoutServiceConfig

# Type Alias: GraphQLLayoutServiceConfig

> **GraphQLLayoutServiceConfig**: `Pick`\<`GraphQLRequestClientConfig`, `"retries"` \| `"retryStrategy"`\> & `Partial`\<`SitecoreConfig`\[`"layout"`\]\> & `object`

Defined in: core/types/layout/graphql-layout-service.d.ts:6

## Type declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../graphql/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### siteName

> **siteName**: `string`

The JSS application name
