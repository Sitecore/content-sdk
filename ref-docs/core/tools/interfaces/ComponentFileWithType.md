[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / ComponentFileWithType

# Interface: ComponentFileWithType

Defined in: [packages/core/src/tools/templating/components.ts:28](https://github.com/Sitecore/content-sdk/blob/5a81f0e52c97aaf1b5f508144fd8acaadf432054/packages/core/src/tools/templating/components.ts#L28)

Describes a file that represents a component definition

## Extends

- [`ComponentFile`](ComponentFile.md)

## Properties

### componentName

> **componentName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:24](https://github.com/Sitecore/content-sdk/blob/5a81f0e52c97aaf1b5f508144fd8acaadf432054/packages/core/src/tools/templating/components.ts#L24)

Name of the code file

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`componentName`](ComponentFile.md#componentname)

***

### componentType

> **componentType**: [`ComponentType`](../type-aliases/ComponentType.md)

Defined in: [packages/core/src/tools/templating/components.ts:29](https://github.com/Sitecore/content-sdk/blob/5a81f0e52c97aaf1b5f508144fd8acaadf432054/packages/core/src/tools/templating/components.ts#L29)

#### Overrides

[`ComponentFile`](ComponentFile.md).[`componentType`](ComponentFile.md#componenttype)

***

### filePath

> **filePath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:21](https://github.com/Sitecore/content-sdk/blob/5a81f0e52c97aaf1b5f508144fd8acaadf432054/packages/core/src/tools/templating/components.ts#L21)

Path to the component or code file

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`filePath`](ComponentFile.md#filepath)

***

### importPath

> **importPath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:22](https://github.com/Sitecore/content-sdk/blob/5a81f0e52c97aaf1b5f508144fd8acaadf432054/packages/core/src/tools/templating/components.ts#L22)

Normalized path that can be used for import statements

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`importPath`](ComponentFile.md#importpath)

***

### moduleName

> **moduleName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:23](https://github.com/Sitecore/content-sdk/blob/5a81f0e52c97aaf1b5f508144fd8acaadf432054/packages/core/src/tools/templating/components.ts#L23)

Normalized name that can be used as import

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`moduleName`](ComponentFile.md#modulename)
