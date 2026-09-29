[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / ComponentFile

# Interface: ComponentFile

Defined in: content/types/tools/templating/component-builder.d.ts:39

Definition for a component file

## Properties

### componentName

> **componentName**: `string`

Defined in: content/types/tools/templating/component-builder.d.ts:47

Name of the code file

***

### componentType?

> `optional` **componentType?**: `ComponentType`

Defined in: content/types/tools/templating/component-builder.d.ts:49

Detected component type (server, client, or universal)

***

### filePath

> **filePath**: `string`

Defined in: content/types/tools/templating/component-builder.d.ts:41

The original file path of the component

***

### importPath

> **importPath**: `string`

Defined in: content/types/tools/templating/component-builder.d.ts:43

Normalized path that can be used for import statements

***

### moduleName

> **moduleName**: `string`

Defined in: content/types/tools/templating/component-builder.d.ts:45

Normalized name that can be used as import
