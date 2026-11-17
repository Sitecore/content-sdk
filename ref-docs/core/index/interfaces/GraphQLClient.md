[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLClient

# Interface: GraphQLClient

Defined in: [packages/core/src/graphql-request-client.ts:12](https://github.com/Sitecore/content-sdk/blob/ea388d67640acc72edb0875cb7b9b9f7c0999fae/packages/core/src/graphql-request-client.ts#L12)

An interface for GraphQL clients for Sitecore APIs

## Methods

### request()

> **request**\<`T`\>(`query`, `variables?`, `options?`): `Promise`\<`T`\>

Defined in: [packages/core/src/graphql-request-client.ts:18](https://github.com/Sitecore/content-sdk/blob/ea388d67640acc72edb0875cb7b9b9f7c0999fae/packages/core/src/graphql-request-client.ts#L18)

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
