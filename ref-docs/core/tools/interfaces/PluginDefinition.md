[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / PluginDefinition

# Interface: PluginDefinition

Defined in: packages/core/src/tools/templating/plugins.ts:26

Definition to be used for plugin registration during bootstrap

## Properties

### distPath

> **distPath**: `string`

Defined in: packages/core/src/tools/templating/plugins.ts:30

destination path to compile plugins to

***

### moduleType

> **moduleType**: [`ModuleType`](../enumerations/ModuleType.md)

Defined in: packages/core/src/tools/templating/plugins.ts:38

CJS or ESM - which type to compile plugins to

***

### relative?

> `optional` **relative**: `boolean`

Defined in: packages/core/src/tools/templating/plugins.ts:42

whether to use relative or absolute paths in the generated file. By default, absolute paths are used.

***

### rootPath

> **rootPath**: `string`

Defined in: packages/core/src/tools/templating/plugins.ts:34

source path for where the plugins are defined

***

### silent?

> `optional` **silent**: `boolean`

Defined in: packages/core/src/tools/templating/plugins.ts:46

whether to suppress console output
