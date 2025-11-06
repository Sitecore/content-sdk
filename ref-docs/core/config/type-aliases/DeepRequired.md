[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [packages/core/src/config/models.ts:7](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/core/src/config/models.ts#L7)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
