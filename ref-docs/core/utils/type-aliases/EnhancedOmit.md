[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / EnhancedOmit

# Type Alias: EnhancedOmit\<T, K\>

> **EnhancedOmit**\<`T`, `K`\> = `{ [P in keyof T as Exclude<P, K>]: T[P] }`

<<<<<<< HEAD
Defined in: [packages/core/src/utils/utils.ts:11](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/utils/utils.ts#L11)
=======
Defined in: [packages/core/src/utils/utils.ts:11](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/utils/utils.ts#L11)
>>>>>>> dd686bb50 (Update API docs)

Omit properties from T that are in K. This is a simplified version of TypeScript's built-in `Omit` utility type.
Since default `Omit` doesn't support indexing types, we had to introduce this custom implementation.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `K` *extends* `PropertyKey` |
