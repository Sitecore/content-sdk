[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [packages/core/src/config/models.ts:6](https://github.com/Sitecore/content-sdk/blob/ccaca47e1d3be54d4807fac59220b223d5ccd97e/packages/core/src/config/models.ts#L6)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
