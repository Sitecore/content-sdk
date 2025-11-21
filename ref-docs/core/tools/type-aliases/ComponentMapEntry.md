[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / ComponentMapEntry

# Type Alias: ComponentMapEntry

> **ComponentMapEntry** = `object`

Defined in: [packages/core/src/tools/templating/components.ts:58](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/components.ts#L58)

**`Internal`**

An entry in the component map, including import lines and value expression.

## Properties

### annotateClient

> **annotateClient**: `boolean`

Defined in: [packages/core/src/tools/templating/components.ts:64](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/components.ts#L64)

whether base is client (and we're in main map)

***

### imports

> **imports**: `string`[]

Defined in: [packages/core/src/tools/templating/components.ts:62](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/components.ts#L62)

namespace import lines needed for this entry

***

### key

> **key**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:60](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/components.ts#L60)

map entry key

***

### valueExpr

> **valueExpr**: `string`

Defined in: [packages/core/src/tools/templating/components.ts:66](https://github.com/Sitecore/content-sdk/blob/9975f7e31344ef66c8d690f766f91fbfddf101f4/packages/core/src/tools/templating/components.ts#L66)

expression used as the map value
