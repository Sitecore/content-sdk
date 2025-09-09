[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:246](https://github.com/Sitecore/content-sdk/blob/7c1616588aced013969dae63e4cf109034a39708/packages/core/src/config/models.ts#L246)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:254](https://github.com/Sitecore/content-sdk/blob/7c1616588aced013969dae63e4cf109034a39708/packages/core/src/config/models.ts#L254)

File extension for the generated component

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:260](https://github.com/Sitecore/content-sdk/blob/7c1616588aced013969dae63e4cf109034a39708/packages/core/src/config/models.ts#L260)

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

Defined in: [packages/core/src/config/models.ts:266](https://github.com/Sitecore/content-sdk/blob/7c1616588aced013969dae63e4cf109034a39708/packages/core/src/config/models.ts#L266)

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

Defined in: [packages/core/src/config/models.ts:250](https://github.com/Sitecore/content-sdk/blob/7c1616588aced013969dae63e4cf109034a39708/packages/core/src/config/models.ts#L250)

Name of the template
