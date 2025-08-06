[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLRequestClient

# Class: GraphQLRequestClient

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:88](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L88)
=======
Defined in: [packages/core/src/graphql-request-client.ts:88](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L88)
>>>>>>> dd686bb50 (Update API docs)

A GraphQL client for Sitecore APIs that uses the 'graphql-request' library.
https://github.com/prisma-labs/graphql-request

## Implements

- [`GraphQLClient`](../interfaces/GraphQLClient.md)

## Constructors

### Constructor

> **new GraphQLRequestClient**(`endpoint`, `clientConfig?`): `GraphQLRequestClient`

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:102](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L102)
=======
Defined in: [packages/core/src/graphql-request-client.ts:102](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L102)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:147](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L147)
=======
Defined in: [packages/core/src/graphql-request-client.ts:147](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L147)
>>>>>>> dd686bb50 (Update API docs)

Execute graphql request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `string` \| `DocumentNode` | graphql query |
| `variables?` | \{[`key`: `string`]: `unknown`; \} | - |
| `options?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`GraphQLClient`](../interfaces/GraphQLClient.md).[`request`](../interfaces/GraphQLClient.md#request)

***

### createClientFactory()

> `static` **createClientFactory**(`config`): [`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:134](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L134)
=======
Defined in: [packages/core/src/graphql-request-client.ts:134](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L134)
>>>>>>> dd686bb50 (Update API docs)

Factory method for creating a GraphQLRequestClientFactory.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GraphQLRequestClientFactoryConfig`](../type-aliases/GraphQLRequestClientFactoryConfig.md) | client configuration options. |

#### Returns

[`GraphQLRequestClientFactory`](../type-aliases/GraphQLRequestClientFactory.md)
