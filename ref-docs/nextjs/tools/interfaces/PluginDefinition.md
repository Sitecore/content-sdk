[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / PluginDefinition

# Interface: PluginDefinition

Defined in: core/types/tools/templating/plugins.d.ts:20

Definition to be used for plugin registration during bootstrap

## Properties

### distPath

> **distPath**: `string`

Defined in: core/types/tools/templating/plugins.d.ts:24

destination path to compile plugins to

***

### moduleType

> **moduleType**: [`ModuleType`](../enumerations/ModuleType.md)

Defined in: core/types/tools/templating/plugins.d.ts:32

CJS or ESM - which type to compile plugins to

***

### relative?

> `optional` **relative**: `boolean`

Defined in: core/types/tools/templating/plugins.d.ts:36

whether to use relative or absolute paths in the generated file. By default, absolute paths are used.

***

### rootPath

> **rootPath**: `string`

Defined in: core/types/tools/templating/plugins.d.ts:28

source path for where the plugins are defined

***

### silent?

> `optional` **silent**: `boolean`

Defined in: core/types/tools/templating/plugins.d.ts:40

whether to suppress console output
