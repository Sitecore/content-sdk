[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:218](https://github.com/Sitecore/content-sdk/blob/f461d2159effd4f50f4ce950c15cc271ac94c771/packages/core/src/config/models.ts#L218)

Represents a scaffold template used for generating components.

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:226](https://github.com/Sitecore/content-sdk/blob/f461d2159effd4f50f4ce950c15cc271ac94c771/packages/core/src/config/models.ts#L226)

File extension for the generated component.

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:232](https://github.com/Sitecore/content-sdk/blob/f461d2159effd4f50f4ce950c15cc271ac94c771/packages/core/src/config/models.ts#L232)

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

Defined in: [packages/core/src/config/models.ts:238](https://github.com/Sitecore/content-sdk/blob/f461d2159effd4f50f4ce950c15cc271ac94c771/packages/core/src/config/models.ts#L238)

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

Defined in: [packages/core/src/config/models.ts:222](https://github.com/Sitecore/content-sdk/blob/f461d2159effd4f50f4ce950c15cc271ac94c771/packages/core/src/config/models.ts#L222)

Name of the template.
