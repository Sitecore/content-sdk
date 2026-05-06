[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLClientError

# Type Alias: GraphQLClientError

> **GraphQLClientError** = `Partial`\<[`ClientError`](../classes/ClientError.md)\> & [`GenericGraphQLClientError`](GenericGraphQLClientError.md)

Defined in: [packages/core/src/graphql-request-client.ts:31](https://github.com/Sitecore/content-sdk/blob/3f9282b10be88272be44a3998ccbb34d4428d66a/packages/core/src/graphql-request-client.ts#L31)

This type represents errors that can occur in a GraphQL client.
In cases where an error status was sent back from the server (`!response.ok`), the `response` will be populated with details. In cases where a response was never received, the `code` can be populated with the error code (e.g. Node's 'ECONNRESET', 'ETIMEDOUT', etc).
