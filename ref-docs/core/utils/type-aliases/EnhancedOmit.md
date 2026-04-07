[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / EnhancedOmit

# Type Alias: EnhancedOmit\<T, K\>

> **EnhancedOmit**\<`T`, `K`\> = `{ [P in keyof T as Exclude<P, K>]: T[P] }`

Defined in: [packages/core/src/utils/utils.ts:12](https://github.com/Sitecore/content-sdk/blob/da3b53344d3ede52bff6bd5a68b0ecae940e12e6/packages/core/src/utils/utils.ts#L12)

Omit properties from T that are in K. This is a simplified version of TypeScript's built-in `Omit` utility type.
Since default `Omit` doesn't support indexing types, we had to introduce this custom implementation.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `K` *extends* `PropertyKey` |
