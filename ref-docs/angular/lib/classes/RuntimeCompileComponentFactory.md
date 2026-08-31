[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / RuntimeCompileComponentFactory

# Class: RuntimeCompileComponentFactory

Defined in: [packages/angular/src/lib/design-library/component-factory.ts:79](https://github.com/Sitecore/content-sdk/blob/8f962400f3b79f00425a8cd76a6d2082b5b47c47/packages/angular/src/lib/design-library/component-factory.ts#L79)

Default [DesignLibraryComponentFactory](../interfaces/DesignLibraryComponentFactory.md): executes the plain-JS preview payload against an
import map, then compiles the resulting class explicitly via `@angular/compiler` (JIT).

Not self-registered in root — it is provided only through [DESIGN\_LIBRARY\_COMPONENT\_FACTORY](../variables/DESIGN_LIBRARY_COMPONENT_FACTORY.md)
(that token is the single injection point). `@Injectable()` is kept without `providedIn` so apps can
still override the token with `useClass: RuntimeCompileComponentFactory` or a subclass.

## Implements

- [`DesignLibraryComponentFactory`](../interfaces/DesignLibraryComponentFactory.md)

## Constructors

### Constructor

> **new RuntimeCompileComponentFactory**(): `RuntimeCompileComponentFactory`

#### Returns

`RuntimeCompileComponentFactory`

## Methods

### buildImportsMap()

> `protected` **buildImportsMap**(`importMap`): `Record`\<`string`, `Record`\<`string`, `unknown`\>\>

Defined in: [packages/angular/src/lib/design-library/component-factory.ts:120](https://github.com/Sitecore/content-sdk/blob/8f962400f3b79f00425a8cd76a6d2082b5b47c47/packages/angular/src/lib/design-library/component-factory.ts#L120)

Builds the ESM-style `imports` map the payload resolves bare specifiers against: a keyed object of
`{ [module]: { [exportName]: value } }`. Accessing a module that is not in the map throws a clear
error (via a Proxy) instead of yielding `undefined`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `importMap` | `ImportEntry`[] | module registry to expose to the payload. |

#### Returns

`Record`\<`string`, `Record`\<`string`, `unknown`\>\>

the guarded import map object.

***

### compile()

> **compile**(`source`, `importMap`): `Promise`\<`Type`\<`unknown`\>\>

Defined in: [packages/angular/src/lib/design-library/component-factory.ts:89](https://github.com/Sitecore/content-sdk/blob/8f962400f3b79f00425a8cd76a6d2082b5b47c47/packages/angular/src/lib/design-library/component-factory.ts#L89)

Compiles a preview payload into a renderable component class.
Browser-only: loads `@angular/compiler` lazily so it stays out of the SSR/prod bundle.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `string` | the plain-JS payload body (assigns `exports.component`/`exports.metadata`). |
| `importMap` | `ImportEntry`[] | module registry used to resolve the payload's imports. |

#### Returns

`Promise`\<`Type`\<`unknown`\>\>

the compiled, renderable component class.

#### Throws

if the payload does not provide a component class and metadata, or an import is missing.

#### Implementation of

[`DesignLibraryComponentFactory`](../interfaces/DesignLibraryComponentFactory.md).[`compile`](../interfaces/DesignLibraryComponentFactory.md#compile)
