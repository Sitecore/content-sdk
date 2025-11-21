[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / PluginDefinition

# Interface: PluginDefinition

Defined in: [packages/core/src/tools/templating/plugins.ts:26](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/plugins.ts#L26)

Definition to be used for plugin registration during bootstrap

## Properties

### distPath

> **distPath**: `string`

Defined in: [packages/core/src/tools/templating/plugins.ts:30](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/plugins.ts#L30)

destination path to compile plugins to

***

### moduleType

> **moduleType**: [`ModuleType`](../enumerations/ModuleType.md)

Defined in: [packages/core/src/tools/templating/plugins.ts:38](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/plugins.ts#L38)

CJS or ESM - which type to compile plugins to

***

### relative?

> `optional` **relative**: `boolean`

Defined in: [packages/core/src/tools/templating/plugins.ts:42](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/plugins.ts#L42)

whether to use relative or absolute paths in the generated file. By default, absolute paths are used.

***

### rootPath

> **rootPath**: `string`

Defined in: [packages/core/src/tools/templating/plugins.ts:34](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/plugins.ts#L34)

source path for where the plugins are defined

***

### silent?

> `optional` **silent**: `boolean`

Defined in: [packages/core/src/tools/templating/plugins.ts:46](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/plugins.ts#L46)

whether to suppress console output
