[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [graphql](../README.md) / GraphQLRequestClient

# Class: GraphQLRequestClient

Defined in: core/types/graphql-request-client.d.ts:82

A GraphQL client for Sitecore APIs that uses the 'graphql-request' library.
https://github.com/prisma-labs/graphql-request

## Implements

- `GraphQLClient`

## Constructors

### new GraphQLRequestClient()

> **new GraphQLRequestClient**(`endpoint`, `clientConfig`?): [`GraphQLRequestClient`](GraphQLRequestClient.md)

Defined in: core/types/graphql-request-client.d.ts:96

Provides ability to execute graphql query using given `endpoint`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `endpoint` | `string` | The Graphql endpoint |
| `clientConfig`? | `GraphQLRequestClientConfig` | GraphQL request client configuration. |

#### Returns

[`GraphQLRequestClient`](GraphQLRequestClient.md)

## Methods

### request()

> **request**\<`T`\>(`query`, `variables`?, `options`?): `Promise`\<`T`\>

Defined in: core/types/graphql-request-client.d.ts:110

Execute graphql request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `string` \| `DocumentNode` | graphql query |
| `variables`? | \{\} | graphql variables |
| `options`? | `RequestOptions` | Options for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>

#### Implementation of

`GraphQLClient.request`

***

### createClientFactory()

> `static` **createClientFactory**(`config`): [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

Defined in: core/types/graphql-request-client.d.ts:103

Factory method for creating a GraphQLRequestClientFactory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GraphQLRequestClientFactoryConfig`](../type-aliases/GraphQLRequestClientFactoryConfig.md) | client configuration options. |

#### Returns

[`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)
