[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:7](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L7)
=======
Defined in: [packages/core/src/config/models.ts:7](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L7)
>>>>>>> dd686bb50 (Update API docs)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
