[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClientFactory

# Type Alias: GraphQLRequestClientFactory()

> **GraphQLRequestClientFactory**: (`config`?) => [`GraphQLRequestClient`](../classes/GraphQLRequestClient.md)

Defined in: [packages/core/src/graphql-request-client.ts:72](https://github.com/Sitecore/xmc-jss-dev/blob/3310bf85cd80a18385c6608a4a61e0c1446ff89e/packages/core/src/graphql-request-client.ts#L72)

A GraphQL Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | `Omit`\<[`GraphQLRequestClientConfig`](GraphQLRequestClientConfig.md), `"apiKey"`\> | The configuration object that specifies how the GraphQL client should be set up. |

## Returns

[`GraphQLRequestClient`](../classes/GraphQLRequestClient.md)

An instance of a GraphQL Request Client ready to send GraphQL requests.
