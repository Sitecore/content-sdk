[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / ComponentFileWithType

# Interface: ComponentFileWithType

Defined in: [packages/core/src/tools/templating/components.ts:39](https://github.com/Sitecore/content-sdk/blob/ca48edcc6e0b5ca5f670bd66a7cf5b742968ebbe/packages/core/src/tools/templating/components.ts#L39)

Describes a file that represents a component definition

## Extends

- [`ComponentFile`](ComponentFile.md)

## Properties

### componentName

> **componentName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:35](https://github.com/Sitecore/content-sdk/blob/ca48edcc6e0b5ca5f670bd66a7cf5b742968ebbe/packages/core/src/tools/templating/components.ts#L35)

Name of the code file

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`componentName`](ComponentFile.md#componentname)

***

### componentType

> **componentType**: [`ComponentType`](../type-aliases/ComponentType.md)

Defined in: [packages/core/src/tools/templating/components.ts:40](https://github.com/Sitecore/content-sdk/blob/ca48edcc6e0b5ca5f670bd66a7cf5b742968ebbe/packages/core/src/tools/templating/components.ts#L40)

#### Overrides

[`ComponentFile`](ComponentFile.md).[`componentType`](ComponentFile.md#componenttype)

***

### filePath

> **filePath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:32](https://github.com/Sitecore/content-sdk/blob/ca48edcc6e0b5ca5f670bd66a7cf5b742968ebbe/packages/core/src/tools/templating/components.ts#L32)

Path to the component or code file

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`filePath`](ComponentFile.md#filepath)

***

### importPath

> **importPath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:33](https://github.com/Sitecore/content-sdk/blob/ca48edcc6e0b5ca5f670bd66a7cf5b742968ebbe/packages/core/src/tools/templating/components.ts#L33)

Normalized path that can be used for import statements

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`importPath`](ComponentFile.md#importpath)

***

### moduleName

> **moduleName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:34](https://github.com/Sitecore/content-sdk/blob/ca48edcc6e0b5ca5f670bd66a7cf5b742968ebbe/packages/core/src/tools/templating/components.ts#L34)

Normalized name that can be used as import

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`moduleName`](ComponentFile.md#modulename)
