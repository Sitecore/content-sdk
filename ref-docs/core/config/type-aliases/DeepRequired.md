[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [packages/core/src/config/models.ts:6](https://github.com/Sitecore/content-sdk/blob/470be402934dbc14c631d24f46582617f7ea8694/packages/core/src/config/models.ts#L6)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
