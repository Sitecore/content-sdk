[**@sitecore-content-sdk/dev-tools**](../README.md)

***

[@sitecore-content-sdk/dev-tools](../README.md) / generatePlugins

# Function: generatePlugins()

> **generatePlugins**(`definition`): `void`

Defined in: [dev-tools/src/templating/plugins.ts:90](https://github.com/Sitecore/xmc-jss-dev/blob/061dc26bfb1145b183edd384dc843a42a29206eb/packages/dev-tools/src/templating/plugins.ts#L90)

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
