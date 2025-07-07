[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:243](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L243)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:251](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L251)

File extension for the generated component

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:257](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L257)

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

Defined in: [packages/core/src/config/models.ts:263](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L263)

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

Defined in: [packages/core/src/config/models.ts:247](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L247)

Name of the template
