[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:268](https://github.com/Sitecore/content-sdk/blob/022af8f424c7ebf42e9ce209f5588bec054e1bde/packages/core/src/config/models.ts#L268)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:276](https://github.com/Sitecore/content-sdk/blob/022af8f424c7ebf42e9ce209f5588bec054e1bde/packages/core/src/config/models.ts#L276)

File extension for the generated component

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:282](https://github.com/Sitecore/content-sdk/blob/022af8f424c7ebf42e9ce209f5588bec054e1bde/packages/core/src/config/models.ts#L282)

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

Defined in: [packages/core/src/config/models.ts:288](https://github.com/Sitecore/content-sdk/blob/022af8f424c7ebf42e9ce209f5588bec054e1bde/packages/core/src/config/models.ts#L288)

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

Defined in: [packages/core/src/config/models.ts:272](https://github.com/Sitecore/content-sdk/blob/022af8f424c7ebf42e9ce209f5588bec054e1bde/packages/core/src/config/models.ts#L272)

Name of the template
