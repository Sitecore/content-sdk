[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AtomsConfig

# Interface: AtomsConfig

Defined in: [packages/react/src/atoms/types.ts:87](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/react/src/atoms/types.ts#L87)

Props the developer passes to the provider for atoms support.

## Properties

### catalog

> **catalog**: `Catalog`\<`any`, [`AtomsCatalogInput`](../type-aliases/AtomsCatalogInput.md)\>

Defined in: [packages/react/src/atoms/types.ts:89](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/react/src/atoms/types.ts#L89)

The json-render catalog (schema + component/action definitions).

***

### navigate?

> `optional` **navigate?**: (`path`) => `void`

Defined in: [packages/react/src/atoms/types.ts:93](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/react/src/atoms/types.ts#L93)

Optional navigate function to be passed to action handlers for navigation purposes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | `string` |

#### Returns

`void`

***

### registry

> **registry**: `DefineRegistryResult`

Defined in: [packages/react/src/atoms/types.ts:91](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/react/src/atoms/types.ts#L91)

The registry result returned by defineAtomsRegistry.
