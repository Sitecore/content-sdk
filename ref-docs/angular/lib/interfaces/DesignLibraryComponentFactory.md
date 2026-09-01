[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / DesignLibraryComponentFactory

# Interface: DesignLibraryComponentFactory

Defined in: [packages/angular/src/lib/design-library/component-factory.ts:59](https://github.com/Sitecore/content-sdk/blob/d8ac4e3318843744564114f23a00a7a35cd2e2c3/packages/angular/src/lib/design-library/component-factory.ts#L59)

Compiles a Design Library preview payload into a renderable component class.

Implemented by [RuntimeCompileComponentFactory](../classes/RuntimeCompileComponentFactory.md) and injected via
[DESIGN\_LIBRARY\_COMPONENT\_FACTORY](../variables/DESIGN_LIBRARY_COMPONENT_FACTORY.md). Depending on this abstraction (rather than the concrete
class) lets an app swap the compilation strategy — for example to stub it in tests or to plug in a
different import-map/compile pipeline — while the renderer keeps ownership of instantiation.

## Methods

### compile()

> **compile**(`source`, `importMap`): `Promise`\<`Type`\<`unknown`\>\>

Defined in: [packages/angular/src/lib/design-library/component-factory.ts:66](https://github.com/Sitecore/content-sdk/blob/d8ac4e3318843744564114f23a00a7a35cd2e2c3/packages/angular/src/lib/design-library/component-factory.ts#L66)

Compiles a preview payload into a renderable component class.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `string` | the plain-JS payload body (assigns `exports.component`/`exports.metadata`). |
| `importMap` | `ImportEntry`[] | module registry used to resolve the payload's imports. |

#### Returns

`Promise`\<`Type`\<`unknown`\>\>

the compiled, renderable component class.
