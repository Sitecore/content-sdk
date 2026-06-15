[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / ComponentImport

# Interface: ComponentImport

Defined in: [content/src/tools/templating/components.ts:98](https://github.com/Sitecore/content-sdk/blob/741a10fca7aacb6f4518425a45f3773d17a013c1/packages/content/src/tools/templating/components.ts#L98)

Definition for custom components to be included in component map.
Use this to define components imported from modules/dependencies/packages

## Properties

### importInfo

> **importInfo**: `object`

Defined in: [content/src/tools/templating/components.ts:102](https://github.com/Sitecore/content-sdk/blob/741a10fca7aacb6f4518425a45f3773d17a013c1/packages/content/src/tools/templating/components.ts#L102)

Information about how to import the package

#### importFrom

> **importFrom**: `string`

The path from which to import the component(s)

#### namedImports?

> `optional` **namedImports?**: `string`[]

The specific named components to import from the package. Leave empty to have whole package be imported as wildcard and allow SXA variants support for component.

***

### importName

> **importName**: `string`

Defined in: [content/src/tools/templating/components.ts:100](https://github.com/Sitecore/content-sdk/blob/741a10fca7aacb6f4518425a45f3773d17a013c1/packages/content/src/tools/templating/components.ts#L100)

The name of the import (e.g., 'MyComponent')
