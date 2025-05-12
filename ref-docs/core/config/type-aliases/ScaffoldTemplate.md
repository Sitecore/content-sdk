[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [packages/core/src/config/models.ts:223](https://github.com/Sitecore/content-sdk/blob/fb68c4a55e5c3ebe3dc131fc54cb32ad43831255/packages/core/src/config/models.ts#L223)

Represents a scaffold template used for generating components.

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [packages/core/src/config/models.ts:231](https://github.com/Sitecore/content-sdk/blob/fb68c4a55e5c3ebe3dc131fc54cb32ad43831255/packages/core/src/config/models.ts#L231)

File extension for the generated component.

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

Defined in: [packages/core/src/config/models.ts:237](https://github.com/Sitecore/content-sdk/blob/fb68c4a55e5c3ebe3dc131fc54cb32ad43831255/packages/core/src/config/models.ts#L237)

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

Defined in: [packages/core/src/config/models.ts:243](https://github.com/Sitecore/content-sdk/blob/fb68c4a55e5c3ebe3dc131fc54cb32ad43831255/packages/core/src/config/models.ts#L243)

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

Defined in: [packages/core/src/config/models.ts:227](https://github.com/Sitecore/content-sdk/blob/fb68c4a55e5c3ebe3dc131fc54cb32ad43831255/packages/core/src/config/models.ts#L227)

Name of the template.
