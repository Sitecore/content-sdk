[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / AtomsConfig

# Interface: AtomsConfig

Defined in: react/types/atoms/types.d.ts:69

Props the developer passes to the provider for atoms support.

## Properties

### catalog

> **catalog**: `Catalog`\<`any`, [`AtomsCatalogInput`](../type-aliases/AtomsCatalogInput.md)\>

Defined in: react/types/atoms/types.d.ts:71

The json-render catalog (schema + component/action definitions).

***

### navigate?

> `optional` **navigate?**: (`path`) => `void`

Defined in: react/types/atoms/types.d.ts:75

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

Defined in: react/types/atoms/types.d.ts:73

The registry result returned by defineAtomsRegistry.
