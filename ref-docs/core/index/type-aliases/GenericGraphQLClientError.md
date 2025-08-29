[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / GenericGraphQLClientError

# Type Alias: GenericGraphQLClientError

> **GenericGraphQLClientError** = `Partial`\<`Error`\> & `object`

Defined in: [packages/core/src/models.ts:14](https://github.com/Sitecore/content-sdk/blob/234dc8363ba417aaccafe59c3c15290368f78da8/packages/core/src/models.ts#L14)

This type represents errors that can occur in a GraphQL client.
In cases where an error status was sent back from the server (`!response.ok`), the `response` will be populated with details. In cases where a response was never received, the `code` can be populated with the error code (e.g. Node's 'ECONNRESET', 'ETIMEDOUT', etc).

## Type declaration

### code?

> `optional` **code**: `string`

### headers?

> `optional` **headers**: `HeadersInit`

### response?

> `optional` **response**: `object`

#### response.headers?

> `optional` **headers**: `Headers`

#### response.ok?

> `optional` **ok**: `boolean`

#### response.status?

> `optional` **status**: `number`
