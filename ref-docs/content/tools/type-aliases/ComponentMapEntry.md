[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / ComponentMapEntry

# Type Alias: ComponentMapEntry

> **ComponentMapEntry** = `object`

Defined in: [content/src/tools/templating/components.ts:56](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/content/src/tools/templating/components.ts#L56)

**`Internal`**

An entry in the component map, including import lines and value expression.

## Properties

### annotateClient

> **annotateClient**: `boolean`

Defined in: [content/src/tools/templating/components.ts:62](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/content/src/tools/templating/components.ts#L62)

whether base is client (and we're in main map)

***

### imports

> **imports**: `string`[]

Defined in: [content/src/tools/templating/components.ts:60](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/content/src/tools/templating/components.ts#L60)

namespace import lines needed for this entry

***

### key

> **key**: `string`

Defined in: [content/src/tools/templating/components.ts:58](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/content/src/tools/templating/components.ts#L58)

map entry key

***

### valueExpr

> **valueExpr**: `string`

Defined in: [content/src/tools/templating/components.ts:64](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/content/src/tools/templating/components.ts#L64)

expression used as the map value
