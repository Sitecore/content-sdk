[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / DeepRequired

# Type Alias: DeepRequired\<T\>

> **DeepRequired**\<`T`\> = `Required`\<`{ [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]> }`\>

Defined in: [content/src/config/models.ts:8](https://github.com/Sitecore/content-sdk/blob/ca2255d7170e21e475637632b0b2a3411f1fd19b/packages/content/src/config/models.ts#L8)

Utility type to make every property in a type required

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
