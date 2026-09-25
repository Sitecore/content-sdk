[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / ComponentFileWithType

# Interface: ComponentFileWithType

Defined in: [content/src/tools/templating/component-builder.ts:68](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/content/src/tools/templating/component-builder.ts#L68)

**`Internal`**

Definition for a component file with guaranteed componentType

## Extends

- [`ComponentFile`](ComponentFile.md)

## Properties

### componentName

> **componentName**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:59](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/content/src/tools/templating/component-builder.ts#L59)

Name of the code file

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`componentName`](ComponentFile.md#componentname)

***

### componentType

> **componentType**: [`ComponentType`](../type-aliases/ComponentType.md)

Defined in: [content/src/tools/templating/component-builder.ts:70](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/content/src/tools/templating/component-builder.ts#L70)

Detected component type (server, client, or universal)

#### Overrides

[`ComponentFile`](ComponentFile.md).[`componentType`](ComponentFile.md#componenttype)

***

### filePath

> **filePath**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:53](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/content/src/tools/templating/component-builder.ts#L53)

The original file path of the component

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`filePath`](ComponentFile.md#filepath)

***

### importPath

> **importPath**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:55](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/content/src/tools/templating/component-builder.ts#L55)

Normalized path that can be used for import statements

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`importPath`](ComponentFile.md#importpath)

***

### moduleName

> **moduleName**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:57](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/content/src/tools/templating/component-builder.ts#L57)

Normalized name that can be used as import

#### Inherited from

[`ComponentFile`](ComponentFile.md).[`moduleName`](ComponentFile.md#modulename)
