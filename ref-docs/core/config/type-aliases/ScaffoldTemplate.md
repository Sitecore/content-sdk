[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:261](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/core/src/config/models.ts#L261)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:269](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/core/src/config/models.ts#L269)

File extension for the generated component

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:275](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/core/src/config/models.ts#L275)

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

Defined in: [packages/core/src/config/models.ts:281](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/core/src/config/models.ts#L281)

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

Defined in: [packages/core/src/config/models.ts:265](https://github.com/Sitecore/content-sdk/blob/19aa69a9a562e99a4bcadccfe233621fb3fdc30e/packages/core/src/config/models.ts#L265)

Name of the template
