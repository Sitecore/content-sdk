[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:269](https://github.com/Sitecore/content-sdk/blob/3e0ae66bfd4d249466803a430fcb3f11a2a9a4a8/packages/core/src/config/models.ts#L269)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:277](https://github.com/Sitecore/content-sdk/blob/3e0ae66bfd4d249466803a430fcb3f11a2a9a4a8/packages/core/src/config/models.ts#L277)

File extension for the generated component

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:283](https://github.com/Sitecore/content-sdk/blob/3e0ae66bfd4d249466803a430fcb3f11a2a9a4a8/packages/core/src/config/models.ts#L283)

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

Defined in: [packages/core/src/config/models.ts:289](https://github.com/Sitecore/content-sdk/blob/3e0ae66bfd4d249466803a430fcb3f11a2a9a4a8/packages/core/src/config/models.ts#L289)

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

Defined in: [packages/core/src/config/models.ts:273](https://github.com/Sitecore/content-sdk/blob/3e0ae66bfd4d249466803a430fcb3f11a2a9a4a8/packages/core/src/config/models.ts#L273)

Name of the template
