[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [packages/core/src/config/models.ts:7](https://github.com/Sitecore/content-sdk/blob/48f6e96b5604a2e6fad496f40949746e41ce959f/packages/core/src/config/models.ts#L7)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
