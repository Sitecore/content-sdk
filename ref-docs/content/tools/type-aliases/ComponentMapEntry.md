[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / ComponentMapEntry

# Type Alias: ComponentMapEntry

> **ComponentMapEntry** = `object`

Defined in: [content/src/tools/templating/component-builder.ts:36](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L36)

**`Internal`**

An entry in the component map, including import lines and value expression.

## Properties

### annotateClient

> **annotateClient**: `boolean`

Defined in: [content/src/tools/templating/component-builder.ts:42](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L42)

whether base is client (and we're in main map)

***

### imports

> **imports**: `string`[]

Defined in: [content/src/tools/templating/component-builder.ts:40](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L40)

namespace import lines needed for this entry

***

### key

> **key**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:38](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L38)

map entry key

***

### valueExpr

> **valueExpr**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:44](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/content/src/tools/templating/component-builder.ts#L44)

expression used as the map value
