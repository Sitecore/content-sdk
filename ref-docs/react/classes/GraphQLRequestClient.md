[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / GraphQLRequestClient

# Class: GraphQLRequestClient

Defined in: packages/core/types/graphql-request-client.d.ts:86

A GraphQL client for Sitecore APIs that uses the 'graphql-request' library.
https://github.com/prisma-labs/graphql-request

## Implements

- `GraphQLClient`

## Constructors

### Constructor

> **new GraphQLRequestClient**(`endpoint`, `clientConfig?`): `GraphQLRequestClient`

Defined in: packages/core/types/graphql-request-client.d.ts:100

Provides ability to execute graphql query using given `endpoint`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `endpoint` | `string` | The Graphql endpoint |
| `clientConfig?` | `GraphQLRequestClientConfig` | GraphQL request client configuration. |

#### Returns

`GraphQLRequestClient`

## Methods

### request()

> **request**\<`T`\>(`query`, `variables?`, `options?`): `Promise`\<`T`\>

Defined in: packages/core/types/graphql-request-client.d.ts:114

Execute graphql request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `string` \| `DocumentNode` | graphql query |
| `variables?` | \{\[`key`: `string`\]: `unknown`; \} | - |
| `options?` | `FetchOptions` | Options for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>

#### Implementation of

`GraphQLClient.request`

***

### createClientFactory()

> `static` **createClientFactory**(`config`): `GraphQLRequestClientFactory`

Defined in: packages/core/types/graphql-request-client.d.ts:108

Factory method for creating a GraphQLRequestClientFactory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GraphQLRequestClientFactoryConfig`](../type-aliases/GraphQLRequestClientFactoryConfig.md) | client configuration options. |

#### Returns

`GraphQLRequestClientFactory`
