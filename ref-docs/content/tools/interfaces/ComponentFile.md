[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / ComponentFile

# Interface: ComponentFile

Defined in: [content/src/tools/templating/component-builder.ts:51](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L51)

Definition for a component file

## Extended by

- [`ComponentFileWithType`](ComponentFileWithType.md)

## Properties

### componentName

> **componentName**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:59](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L59)

Name of the code file

***

### componentType?

> `optional` **componentType?**: [`ComponentType`](../type-aliases/ComponentType.md)

Defined in: [content/src/tools/templating/component-builder.ts:61](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L61)

Detected component type (server, client, or universal)

***

### filePath

> **filePath**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:53](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L53)

The original file path of the component

***

### importPath

> **importPath**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:55](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L55)

Normalized path that can be used for import statements

***

### moduleName

> **moduleName**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:57](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L57)

Normalized name that can be used as import
