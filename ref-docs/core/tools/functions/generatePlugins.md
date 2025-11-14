[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / generatePlugins

# Function: generatePlugins()

> **generatePlugins**(`definition`): `void`

Defined in: [packages/core/src/tools/templating/plugins.ts:90](https://github.com/Sitecore/content-sdk/blob/d8ae2590595a63af1db69210c03d2b0cb33f5a0e/packages/core/src/tools/templating/plugins.ts#L90)

Generates the plugins file and saves it to the filesystem.
By convention, we expect to find plugins under {pluginName}/plugins/** (subfolders are searched recursively).
generated file will be saved to

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `definition` | [`PluginDefinition`](../interfaces/PluginDefinition.md) | plugin definition |

## Returns

`void`

## Var

and will contain a list of plugins in the following format:
CJS: exports.fooPlugin = require('{pluginPath}');
ESM: export { fooPlugin } from '{pluginPath}';

## Example

```ts
generatePlugins({ distPath: 'src/temp/foo-plugins.js', rootPath: 'src/foo/plugins', moduleType: ModuleType.CJS })
```
