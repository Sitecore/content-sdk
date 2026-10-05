[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

Defined in: [content/src/config/models.ts:310](https://github.com/Sitecore/content-sdk/blob/958b502d1704bb305d7d8f1373f43324336459f6/packages/content/src/config/models.ts#L310)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

Defined in: [content/src/config/models.ts:318](https://github.com/Sitecore/content-sdk/blob/958b502d1704bb305d7d8f1373f43324336459f6/packages/content/src/config/models.ts#L318)

File extension for the generated component

***

### generateTemplate

> **generateTemplate**: (`componentName`) => `string`

Defined in: [content/src/config/models.ts:324](https://github.com/Sitecore/content-sdk/blob/958b502d1704bb305d7d8f1373f43324336459f6/packages/content/src/config/models.ts#L324)

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

Defined in: [content/src/config/models.ts:330](https://github.com/Sitecore/content-sdk/blob/958b502d1704bb305d7d8f1373f43324336459f6/packages/content/src/config/models.ts#L330)

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

Defined in: [content/src/config/models.ts:314](https://github.com/Sitecore/content-sdk/blob/958b502d1704bb305d7d8f1373f43324336459f6/packages/content/src/config/models.ts#L314)

Name of the template
