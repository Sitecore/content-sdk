[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLClient

# Interface: GraphQLClient

Defined in: [packages/core/src/graphql-request-client.ts:13](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/graphql-request-client.ts#L13)

An interface for GraphQL clients for Sitecore APIs

## Methods

### request()

> **request**\<`T`\>(`query`, `variables?`, `options?`): `Promise`\<`T`\>

Defined in: [packages/core/src/graphql-request-client.ts:19](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/graphql-request-client.ts#L19)

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
| `options?` | [`FetchOptions`](../type-aliases/FetchOptions.md) | options and variables for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>
