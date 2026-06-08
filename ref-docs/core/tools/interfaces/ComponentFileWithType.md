[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / ComponentFileWithType

# Interface: ComponentFileWithType

Defined in: [packages/core/src/tools/templating/components.ts:88](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/templating/components.ts#L88)

**`Internal`**

Definition for a component file with guaranteed componentType

## Extends

- [`ComponentFile`](ComponentFile.md)

## Properties

### componentName

> **componentName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:79](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/templating/components.ts#L79)

Name of the code file

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`componentName`](ComponentFile.md#componentname)

***

### componentType

> **componentType**: [`ComponentType`](../type-aliases/ComponentType.md)

Defined in: [packages/core/src/tools/templating/components.ts:90](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/templating/components.ts#L90)

Detected component type (server, client, or universal)

#### Overrides

[`ComponentFile`](ComponentFile.md).[`componentType`](ComponentFile.md#componenttype)

***

### filePath

> **filePath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:73](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/templating/components.ts#L73)

The original file path of the component

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`filePath`](ComponentFile.md#filepath)

***

### importPath

> **importPath**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:75](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/templating/components.ts#L75)

Normalized path that can be used for import statements

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`importPath`](ComponentFile.md#importpath)

***

### moduleName

> **moduleName**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:77](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/templating/components.ts#L77)

Normalized name that can be used as import

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`moduleName`](ComponentFile.md#modulename)
