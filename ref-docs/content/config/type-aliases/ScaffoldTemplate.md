[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [content/src/config/models.ts:277](https://github.com/Sitecore/content-sdk/blob/170cbe9237292df82e9fbc54971cd7ffa5d9a3c9/packages/content/src/config/models.ts#L277)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [content/src/config/models.ts:285](https://github.com/Sitecore/content-sdk/blob/170cbe9237292df82e9fbc54971cd7ffa5d9a3c9/packages/content/src/config/models.ts#L285)

File extension for the generated component

***

### generateTemplate

> **generateTemplate**: (`componentName`) => `string`

Defined in: [content/src/config/models.ts:291](https://github.com/Sitecore/content-sdk/blob/170cbe9237292df82e9fbc54971cd7ffa5d9a3c9/packages/content/src/config/models.ts#L291)

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

Defined in: [content/src/config/models.ts:297](https://github.com/Sitecore/content-sdk/blob/170cbe9237292df82e9fbc54971cd7ffa5d9a3c9/packages/content/src/config/models.ts#L297)

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

Defined in: [content/src/config/models.ts:281](https://github.com/Sitecore/content-sdk/blob/170cbe9237292df82e9fbc54971cd7ffa5d9a3c9/packages/content/src/config/models.ts#L281)

Name of the template
