[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / ComponentImport

# Interface: ComponentImport

Defined in: [packages/core/src/tools/templating/components.ts:80](https://github.com/Sitecore/content-sdk/blob/2e20c6b303a6c7f1a189e1e2fa45e81b8daa7288/packages/core/src/tools/templating/components.ts#L80)

Definition for custom components to be included in component map.
Use this to define components imported from modules/dependencies/packages

## Properties

### importInfo

> **importInfo**: `object`

Defined in: [packages/core/src/tools/templating/components.ts:84](https://github.com/Sitecore/content-sdk/blob/2e20c6b303a6c7f1a189e1e2fa45e81b8daa7288/packages/core/src/tools/templating/components.ts#L84)

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

Defined in: [packages/core/src/tools/templating/components.ts:82](https://github.com/Sitecore/content-sdk/blob/2e20c6b303a6c7f1a189e1e2fa45e81b8daa7288/packages/core/src/tools/templating/components.ts#L82)

The name of the import (e.g., 'MyComponent')
