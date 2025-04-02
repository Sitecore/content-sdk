[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate**: `object`

Defined in: [packages/core/src/config/models.ts:218](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/config/models.ts#L218)

Represents a scaffold template used for generating components.

## Type declaration

### fileExtension

> **fileExtension**: `string`

File extension for the generated component.

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Function to generate the component file contents based on the component name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentName` | `string` | The name of the component. |

#### Returns

`string`

The generated content as a string.

### getNextSteps()?

> `optional` **getNextSteps**: (`componentOutputPath`) => `string`[]

Optional function to get the next steps to be shown by the cli after generating the component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentOutputPath` | `string` | The output path of the generated component. |

#### Returns

`string`[]

An array of strings representing the next steps.

### name

> **name**: `string`

Name of the template.
