[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / GraphQLClientError

# Type Alias: GraphQLClientError

> **GraphQLClientError** = `Partial`\<[`ClientError`](../../index/classes/ClientError.md)\> & [`GenericGraphQLClientError`](../../index/type-aliases/GenericGraphQLClientError.md)

Defined in: [packages/core/src/graphql-request-client.ts:29](https://github.com/Sitecore/content-sdk/blob/af8b412b06b078731c4e0c34b094b68cd0919267/packages/core/src/graphql-request-client.ts#L29)

This type represents errors that can occur in a GraphQL client.
In cases where an error status was sent back from the server (`!response.ok`), the `response` will be populated with details. In cases where a response was never received, the `code` can be populated with the error code (e.g. Node's 'ECONNRESET', 'ETIMEDOUT', etc).
