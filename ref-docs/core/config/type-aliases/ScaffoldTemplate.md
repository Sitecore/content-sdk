[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / ScaffoldTemplate

# Type Alias: ScaffoldTemplate

> **ScaffoldTemplate** = `object`

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:248](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L248)
=======
Defined in: [packages/core/src/config/models.ts:248](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L248)
>>>>>>> dd686bb50 (Update API docs)

Represents a scaffold template used for generating components

## Properties

### fileExtension

> **fileExtension**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:256](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L256)
=======
Defined in: [packages/core/src/config/models.ts:256](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L256)
>>>>>>> dd686bb50 (Update API docs)

File extension for the generated component

***

### generateTemplate()

> **generateTemplate**: (`componentName`) => `string`

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:262](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L262)
=======
Defined in: [packages/core/src/config/models.ts:262](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L262)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:268](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L268)
=======
Defined in: [packages/core/src/config/models.ts:268](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L268)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:252](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L252)
=======
Defined in: [packages/core/src/config/models.ts:252](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L252)
>>>>>>> dd686bb50 (Update API docs)

Name of the template
