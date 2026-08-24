[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [atoms](../README.md) / AtomsConfig

# Interface: AtomsConfig

Defined in: react/types/atoms/types.d.ts:59

Props the developer passes to the provider for atoms support.

## Properties

### catalog

> **catalog**: `Catalog`\<`any`, [`AtomsCatalogInput`](../type-aliases/AtomsCatalogInput.md)\>

Defined in: react/types/atoms/types.d.ts:61

The json-render catalog (schema + component/action definitions).

***

### compileCssAction?

> `optional` **compileCssAction?**: (`classes`) => `Promise`\<`string`\>

Defined in: react/types/atoms/types.d.ts:88

Optional Server Action used to compile CSS for dynamic Document class names
during editing (Design Library) sessions.

For Next.js App Router starters, pass `compileCssForDocumentAction` from
`@sitecore-content-sdk/nextjs/server-actions`. Register a compiler first via
`registerTailwindCssCompiler` (or `setAtomsCssCompiler`) in `instrumentation.ts`.
When provided, `DesignLibraryLowCodeComponent` injects a `<style>` tag after each
Document update so classes authored in MMS Documents are styled.

Has no effect in production; production CSS injection is handled server-side by
`StudioComponentServerWrapper` using the same registered compiler.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `classes` | `string`[] |

#### Returns

`Promise`\<`string`\>

#### Example

```tsx
// src/Providers.tsx  ('use client')
import { compileCssForDocumentAction } from '@sitecore-content-sdk/nextjs/server-actions';

<SitecoreProvider
  atomsConfig={{ catalog, registry, navigate, compileCssAction: compileCssForDocumentAction }}
/>
```

***

### navigate?

> `optional` **navigate?**: (`path`) => `void`

Defined in: react/types/atoms/types.d.ts:65

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

Defined in: react/types/atoms/types.d.ts:63

The registry result returned by defineAtomsRegistry.
