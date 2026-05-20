[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClientFactory

# Type Alias: GraphQLRequestClientFactory()

> **GraphQLRequestClientFactory** = (`config?`) => [`GraphQLRequestClient`](../classes/GraphQLRequestClient.md)

Defined in: [packages/core/src/graphql-request-client.ts:80](https://github.com/Sitecore/content-sdk/blob/3b25a6307ef74f6ab7da606ec8b04e5fcb108ad3/packages/core/src/graphql-request-client.ts#L80)

A GraphQL Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | `Omit`\<[`GraphQLRequestClientConfig`](GraphQLRequestClientConfig.md), `"apiKey"` \| `"contextId"`\> | The configuration object that specifies how the GraphQL client should be set up. |

## Returns

[`GraphQLRequestClient`](../classes/GraphQLRequestClient.md)

An instance of a GraphQL Request Client ready to send GraphQL requests.
