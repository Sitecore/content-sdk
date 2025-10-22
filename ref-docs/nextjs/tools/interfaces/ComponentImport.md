[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / ComponentImport

# Interface: ComponentImport

Defined in: core/types/tools/templating/components.d.ts:46

Definition for custom components to be included in component map.
Use this to define components imported from modules/dependencies/packages

## Properties

### importInfo

> **importInfo**: `object`

Defined in: core/types/tools/templating/components.d.ts:50

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

Defined in: core/types/tools/templating/components.d.ts:48

The name of the import (e.g., 'MyComponent')
