[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [packages/core/src/sitecore-config.ts:7](https://github.com/Sitecore/content-sdk/blob/11719c29a76964a5138c9b66c4ad7c2c94a0da6d/packages/core/src/sitecore-config.ts#L7)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
