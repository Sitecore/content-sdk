[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLClient

# Interface: GraphQLClient

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:12](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L12)
=======
Defined in: [packages/core/src/graphql-request-client.ts:12](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L12)
>>>>>>> dd686bb50 (Update API docs)

An interface for GraphQL clients for Sitecore APIs

## Methods

### request()

> **request**\<`T`\>(`query`, `variables?`, `options?`): `Promise`\<`T`\>

<<<<<<< HEAD
Defined in: [packages/core/src/graphql-request-client.ts:18](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/graphql-request-client.ts#L18)
=======
Defined in: [packages/core/src/graphql-request-client.ts:18](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/graphql-request-client.ts#L18)
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
| `options?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | options and variables for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>
