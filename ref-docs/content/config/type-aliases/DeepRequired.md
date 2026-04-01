[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [content/src/config/models.ts:8](https://github.com/Sitecore/content-sdk/blob/d3ca076cf2eb9ac3638fcded92c92cbd74337854/packages/content/src/config/models.ts#L8)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
