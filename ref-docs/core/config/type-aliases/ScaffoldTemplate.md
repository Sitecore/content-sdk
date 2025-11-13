[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:228](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/config/models.ts#L228)

Represents a scaffold template used for generating components.

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:236](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/config/models.ts#L236)

File extension for the generated component.

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:242](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/config/models.ts#L242)

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

Defined in: [packages/core/src/config/models.ts:248](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/config/models.ts#L248)

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

Defined in: [packages/core/src/config/models.ts:232](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/config/models.ts#L232)

Name of the template.
