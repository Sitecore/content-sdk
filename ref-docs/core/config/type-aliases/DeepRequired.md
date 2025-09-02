[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [packages/core/src/config/models.ts:7](https://github.com/Sitecore/content-sdk/blob/084c73091f76950d3d052732a34e9c3c118b9748/packages/core/src/config/models.ts#L7)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
