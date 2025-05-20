[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:230](https://github.com/Sitecore/content-sdk/blob/8b51c27af4197381ca0801342e71e5225c33820b/packages/core/src/config/models.ts#L230)

Represents a scaffold template used for generating components.

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:238](https://github.com/Sitecore/content-sdk/blob/8b51c27af4197381ca0801342e71e5225c33820b/packages/core/src/config/models.ts#L238)

File extension for the generated component.

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:244](https://github.com/Sitecore/content-sdk/blob/8b51c27af4197381ca0801342e71e5225c33820b/packages/core/src/config/models.ts#L244)

Function to generate the component file contents based on the component name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentName` | `string` | The name of the component. |

#### Returns

`string`

The generated content as a string.

***

### getNextSteps()?

> `optional` **getNextSteps**: (`componentOutputPath`) => `string`[]

Defined in: [packages/core/src/config/models.ts:250](https://github.com/Sitecore/content-sdk/blob/8b51c27af4197381ca0801342e71e5225c33820b/packages/core/src/config/models.ts#L250)

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

Defined in: [packages/core/src/config/models.ts:234](https://github.com/Sitecore/content-sdk/blob/8b51c27af4197381ca0801342e71e5225c33820b/packages/core/src/config/models.ts#L234)

Name of the template.
