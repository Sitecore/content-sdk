[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / PluginDefinition

# Interface: PluginDefinition

Defined in: [packages/core/src/tools/templating/plugins.ts:24](https://github.com/Sitecore/content-sdk/blob/a58e45a650450e7f7208c20ca2205e26a964c0ce/packages/core/src/tools/templating/plugins.ts#L24)

Definition to be used for plugin registration during bootstrap

## Properties

### distPath

> **distPath**: `string`

Defined in: [packages/core/src/tools/templating/plugins.ts:28](https://github.com/Sitecore/content-sdk/blob/a58e45a650450e7f7208c20ca2205e26a964c0ce/packages/core/src/tools/templating/plugins.ts#L28)

destination path to compile plugins to

***

### moduleType

> **moduleType**: [`ModuleType`](../enumerations/ModuleType.md)

Defined in: [packages/core/src/tools/templating/plugins.ts:36](https://github.com/Sitecore/content-sdk/blob/a58e45a650450e7f7208c20ca2205e26a964c0ce/packages/core/src/tools/templating/plugins.ts#L36)

CJS or ESM - which type to compile plugins to

***

### relative?

> `optional` **relative**: `boolean`

Defined in: [packages/core/src/tools/templating/plugins.ts:40](https://github.com/Sitecore/content-sdk/blob/a58e45a650450e7f7208c20ca2205e26a964c0ce/packages/core/src/tools/templating/plugins.ts#L40)

whether to use relative or absolute paths in the generated file. By default, absolute paths are used.

***

### rootPath

> **rootPath**: `string`

Defined in: [packages/core/src/tools/templating/plugins.ts:32](https://github.com/Sitecore/content-sdk/blob/a58e45a650450e7f7208c20ca2205e26a964c0ce/packages/core/src/tools/templating/plugins.ts#L32)

source path for where the plugins are defined

***

### silent?

> `optional` **silent**: `boolean`

Defined in: [packages/core/src/tools/templating/plugins.ts:44](https://github.com/Sitecore/content-sdk/blob/a58e45a650450e7f7208c20ca2205e26a964c0ce/packages/core/src/tools/templating/plugins.ts#L44)

whether to suppress console output
