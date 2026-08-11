[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClient

# Class: GraphQLRequestClient

Defined in: [packages/core/src/graphql-request-client.ts:96](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/core/src/graphql-request-client.ts#L96)

A GraphQL client for Sitecore APIs that uses the 'graphql-request' library.
https://github.com/prisma-labs/graphql-request

## Implements

- [`GraphQLClient`](../interfaces/GraphQLClient.md)

## Constructors

### Constructor

> **new GraphQLRequestClient**(`endpoint`, `clientConfig?`): `GraphQLRequestClient`

Defined in: [packages/core/src/graphql-request-client.ts:110](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/core/src/graphql-request-client.ts#L110)

Provides ability to execute graphql query using given `endpoint`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `endpoint` | `string` | The Graphql endpoint |
| `clientConfig?` | [`GraphQLRequestClientConfig`](../type-aliases/GraphQLRequestClientConfig.md) | GraphQL request client configuration. |

#### Returns

`GraphQLRequestClient`

## Methods

### request()

> **request**\<`T`\>(`query`, `variables?`, `options?`): `Promise`\<`T`\>

Defined in: [packages/core/src/graphql-request-client.ts:168](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/core/src/graphql-request-client.ts#L168)

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
| `options?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | Options for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`GraphQLClient`](../interfaces/GraphQLClient.md).[`request`](../interfaces/GraphQLClient.md#request)

***

### createClientFactory()

> `static` **createClientFactory**(`config`): [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/graphql-request-client.ts:155](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/core/src/graphql-request-client.ts#L155)

Factory method for creating a GraphQLRequestClientFactory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GraphQLRequestClientFactoryConfig`](../type-aliases/GraphQLRequestClientFactoryConfig.md) | client configuration options. |

#### Returns

[`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)
