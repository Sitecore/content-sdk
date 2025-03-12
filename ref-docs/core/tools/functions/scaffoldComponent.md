[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / scaffoldComponent

# Function: scaffoldComponent()

> **scaffoldComponent**(`outputFilePath`, `componentName`, `templateName`, `templates`): `void`

Defined in: [packages/core/src/tools/scaffold.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/6e5665d172771ee08cfda4cf96a47c6e72fabf54/packages/core/src/tools/scaffold.ts#L46)

Scaffolds a new component based on the provided template.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `outputFilePath` | `string` | The file path where the component will be created. |
| `componentName` | `string` | The name of the component to be created. |
| `templateName` | `string` | The name of the template to use for scaffolding. If not provided, defaults to 'byoc' if `byoc` is true, otherwise 'default'. |
| `templates` | [`ScaffoldTemplate`](../../config/type-aliases/ScaffoldTemplate.md)[] | An array of template objects, each containing a name, a template function, and a getNextSteps function. |

## Returns

`void`

## Throws

Will throw an error if the specified template is not found.
