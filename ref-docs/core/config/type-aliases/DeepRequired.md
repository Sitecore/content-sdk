[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [packages/core/src/config/models.ts:6](https://github.com/Sitecore/xmc-jss-dev/blob/b958912809996db10220a105056215d43fb2c6d5/packages/core/src/config/models.ts#L6)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
