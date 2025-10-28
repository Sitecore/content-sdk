[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / ComponentFile

# Interface: ComponentFile

Defined in: [packages/core/src/tools/templating/components.ts:55](https://github.com/Sitecore/content-sdk/blob/34c7cd724603943e1a1fa289cebab8b5d2a77b03/packages/core/src/tools/templating/components.ts#L55)

Definition for a component file

## Extended by

- [`ComponentFileWithType`](ComponentFileWithType.md)

## Properties

### componentName

> **componentName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:63](https://github.com/Sitecore/content-sdk/blob/34c7cd724603943e1a1fa289cebab8b5d2a77b03/packages/core/src/tools/templating/components.ts#L63)

Name of the code file

***

### componentType?

> `optional` **componentType**: [`ComponentType`](../type-aliases/ComponentType.md)

Defined in: [packages/core/src/tools/templating/components.ts:65](https://github.com/Sitecore/content-sdk/blob/34c7cd724603943e1a1fa289cebab8b5d2a77b03/packages/core/src/tools/templating/components.ts#L65)

Detected component type (server, client, or universal)

***

### filePath

> **filePath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:57](https://github.com/Sitecore/content-sdk/blob/34c7cd724603943e1a1fa289cebab8b5d2a77b03/packages/core/src/tools/templating/components.ts#L57)

The original file path of the component

***

### importPath

> **importPath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:59](https://github.com/Sitecore/content-sdk/blob/34c7cd724603943e1a1fa289cebab8b5d2a77b03/packages/core/src/tools/templating/components.ts#L59)

Normalized path that can be used for import statements

***

### moduleName

> **moduleName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:61](https://github.com/Sitecore/content-sdk/blob/34c7cd724603943e1a1fa289cebab8b5d2a77b03/packages/core/src/tools/templating/components.ts#L61)

Normalized name that can be used as import
