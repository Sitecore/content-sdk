[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / ComponentImport

# Interface: ComponentImport

Defined in: content/types/tools/templating/components.d.ts:71

Definition for custom components to be included in component map.
Use this to define components imported from modules/dependencies/packages

## Properties

### importInfo

> **importInfo**: `object`

Defined in: content/types/tools/templating/components.d.ts:75

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

Defined in: content/types/tools/templating/components.d.ts:73

The name of the import (e.g., 'MyComponent')
