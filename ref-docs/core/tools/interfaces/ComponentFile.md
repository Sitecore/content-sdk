[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / ComponentFile

# Interface: ComponentFile

Defined in: [packages/core/src/tools/templating/components.ts:71](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/core/src/tools/templating/components.ts#L71)

Definition for a component file

## Extended by

- [`ComponentFileWithType`](ComponentFileWithType.md)

## Properties

### componentName

> **componentName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:79](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/core/src/tools/templating/components.ts#L79)

Name of the code file

***

### componentType?

> `optional` **componentType**: [`ComponentType`](../type-aliases/ComponentType.md)

Defined in: [packages/core/src/tools/templating/components.ts:81](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/core/src/tools/templating/components.ts#L81)

Detected component type (server, client, or universal)

***

### filePath

> **filePath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:73](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/core/src/tools/templating/components.ts#L73)

The original file path of the component

***

### importPath

> **importPath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:75](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/core/src/tools/templating/components.ts#L75)

Normalized path that can be used for import statements

***

### moduleName

> **moduleName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:77](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/core/src/tools/templating/components.ts#L77)

Normalized name that can be used as import
