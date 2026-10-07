[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / ComponentMapEntry

# Type Alias: ComponentMapEntry

> **ComponentMapEntry** = `object`

Defined in: [content/src/tools/templating/component-builder.ts:36](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/tools/templating/component-builder.ts#L36)

**`Internal`**

An entry in the component map, including import lines and value expression.

## Properties

### annotateClient

> **annotateClient**: `boolean`

Defined in: [content/src/tools/templating/component-builder.ts:42](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/tools/templating/component-builder.ts#L42)

whether base is client (and we're in main map)

***

### imports

> **imports**: `string`[]

Defined in: [content/src/tools/templating/component-builder.ts:40](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/tools/templating/component-builder.ts#L40)

namespace import lines needed for this entry

***

### key

> **key**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:38](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/tools/templating/component-builder.ts#L38)

map entry key

***

### valueExpr

> **valueExpr**: `string`

Defined in: [content/src/tools/templating/component-builder.ts:44](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/content/src/tools/templating/component-builder.ts#L44)

expression used as the map value
