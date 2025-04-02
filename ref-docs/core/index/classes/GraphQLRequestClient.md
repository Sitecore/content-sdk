[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClient

# Class: GraphQLRequestClient

Defined in: [packages/core/src/graphql-request-client.ts:88](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/graphql-request-client.ts#L88)

A GraphQL client for Sitecore APIs that uses the 'graphql-request' library.
https://github.com/prisma-labs/graphql-request

## Implements

- [`GraphQLClient`](../interfaces/GraphQLClient.md)

## Constructors

### new GraphQLRequestClient()

> **new GraphQLRequestClient**(`endpoint`, `clientConfig`?): [`GraphQLRequestClient`](GraphQLRequestClient.md)

Defined in: [packages/core/src/graphql-request-client.ts:102](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/graphql-request-client.ts#L102)

Provides ability to execute graphql query using given `endpoint`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `endpoint` | `string` | The Graphql endpoint |
| `clientConfig`? | [`GraphQLRequestClientConfig`](../type-aliases/GraphQLRequestClientConfig.md) | GraphQL request client configuration. |

#### Returns

[`GraphQLRequestClient`](GraphQLRequestClient.md)

## Methods

### request()

> **request**\<`T`\>(`query`, `variables`?, `options`?): `Promise`\<`T`\>

Defined in: [packages/core/src/graphql-request-client.ts:147](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/graphql-request-client.ts#L147)

Execute graphql request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `string` \| `DocumentNode` | graphql query |
| `variables`? | \{\} | - |
| `options`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`GraphQLClient`](../interfaces/GraphQLClient.md).[`request`](../interfaces/GraphQLClient.md#request)

***

### createClientFactory()

> `static` **createClientFactory**(`config`): [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/graphql-request-client.ts:134](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/graphql-request-client.ts#L134)

Factory method for creating a GraphQLRequestClientFactory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GraphQLRequestClientFactoryConfig`](../type-aliases/GraphQLRequestClientFactoryConfig.md) | client configuration options. |

#### Returns

[`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)
