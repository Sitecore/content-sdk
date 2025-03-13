[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / generateComponentBuilder

# Function: generateComponentBuilder()

> **generateComponentBuilder**(`settings`?): `void`

Defined in: [nextjs/src/tools/templating/generate-component-builder.ts:24](https://github.com/Sitecore/xmc-jss-dev/blob/2587fa13814e20ee230863406a92229f2eebdb43/packages/nextjs/src/tools/templating/generate-component-builder.ts#L24)

Generate component builder based on provided settings

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `settings`? | \{ `componentBuilderOutputPath`: `string`; `componentRootPath`: `string`; `components`: [`ComponentFile`](../interfaces/ComponentFile.md)[]; `packages`: [`PackageDefinition`](../interfaces/PackageDefinition.md)[]; `watch`: `boolean`; \} | settings for component builder generation |
| `settings.componentBuilderOutputPath`? | `string` | path to component builder output |
| `settings.componentRootPath`? | `string` | path to components root |
| `settings.components`? | [`ComponentFile`](../interfaces/ComponentFile.md)[] | list of components to include in component builder |
| `settings.packages`? | [`PackageDefinition`](../interfaces/PackageDefinition.md)[] | list of packages to include in component builder |
| `settings.watch`? | `boolean` | whether to watch for changes to component builder sources |

## Returns

`void`
