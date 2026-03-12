[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [content/src/config/models.ts:8](https://github.com/Sitecore/content-sdk/blob/3375ae0859762b6129a6c8498ac6a605b43f0bd6/packages/content/src/config/models.ts#L8)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
