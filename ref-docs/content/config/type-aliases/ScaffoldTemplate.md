[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [content/src/config/models.ts:69](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/content/src/config/models.ts#L69)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [content/src/config/models.ts:77](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/content/src/config/models.ts#L77)

File extension for the generated component

***

### generateTemplate

> **generateTemplate**: (`componentName`) => `string`

Defined in: [content/src/config/models.ts:83](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/content/src/config/models.ts#L83)

Function to generate the component file contents based on the component name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentName` | `string` | The name of the component. |

#### Returns

`string`

The generated content as a string.

***

### getNextSteps?

> `optional` **getNextSteps?**: (`componentOutputPath`) => `string`[]

Defined in: [content/src/config/models.ts:89](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/content/src/config/models.ts#L89)

Optional function to get the next steps to be shown by the cli after generating the component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentOutputPath` | `string` | The output path of the generated component. |

#### Returns

`string`[]

An array of strings representing the next steps.

***

### name

> **name**: `string`

Defined in: [content/src/config/models.ts:73](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/content/src/config/models.ts#L73)

Name of the template
