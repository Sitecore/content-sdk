[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / ComponentImport

# Interface: ComponentImport

Defined in: [packages/core/src/tools/templating/components.ts:100](https://github.com/Sitecore/content-sdk/blob/4867cc2c17164b3451c55daacc6edef1f1f5d463/packages/core/src/tools/templating/components.ts#L100)

Definition for custom components to be included in component map.
Use this to define components imported from modules/dependencies/packages

## Properties

### importInfo

> **importInfo**: `object`

Defined in: [packages/core/src/tools/templating/components.ts:104](https://github.com/Sitecore/content-sdk/blob/4867cc2c17164b3451c55daacc6edef1f1f5d463/packages/core/src/tools/templating/components.ts#L104)

Information about how to import the package

#### importFrom

> **importFrom**: `string`

The path from which to import the component(s)

#### namedImports?

> `optional` **namedImports**: `string`[]

The specific named components to import from the package. Leave empty to have whole package be imported as wildcard and allow SXA variants support for component.

***

### importName

> **importName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:102](https://github.com/Sitecore/content-sdk/blob/4867cc2c17164b3451c55daacc6edef1f1f5d463/packages/core/src/tools/templating/components.ts#L102)

The name of the import (e.g., 'MyComponent')
