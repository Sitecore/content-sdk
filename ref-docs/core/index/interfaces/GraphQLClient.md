[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GraphQLClient

# Interface: GraphQLClient

Defined in: [packages/core/src/graphql-request-client.ts:19](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/core/src/graphql-request-client.ts#L19)

An interface for GraphQL clients for Sitecore APIs

## Methods

### request()

> **request**\<`T`\>(`query`, `variables`?, `options`?): `Promise`\<`T`\>

Defined in: [packages/core/src/graphql-request-client.ts:26](https://github.com/Sitecore/xmc-jss-dev/blob/f4a8fa660d68db3c8a3a184bf4bb6c838e2b1802/packages/core/src/graphql-request-client.ts#L26)

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
| `options`? | `RequestOptions` | options for configuring a GraphQL request. |

#### Returns

`Promise`\<`T`\>
