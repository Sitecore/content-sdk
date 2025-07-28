[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [packages/core/src/config/models.ts:7](https://github.com/Sitecore/content-sdk/blob/07b4e06d905b3449e7af39083888c975ab2e1a04/packages/core/src/config/models.ts#L7)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
