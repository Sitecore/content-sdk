[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AtomsConfig

# Interface: AtomsConfig

Defined in: [packages/react/src/atoms/types.ts:89](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/react/src/atoms/types.ts#L89)

Props the developer passes to the provider for atoms support.

## Properties

### catalog

> **catalog**: [`AtomsCatalog`](../type-aliases/AtomsCatalog.md)

Defined in: [packages/react/src/atoms/types.ts:91](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/react/src/atoms/types.ts#L91)

The json-render catalog (schema + component/action definitions).

***

### compileCssAction?

> `optional` **compileCssAction?**: (`classes`) => `Promise`\<`string`\>

Defined in: [packages/react/src/atoms/types.ts:118](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/react/src/atoms/types.ts#L118)

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

Defined in: [packages/react/src/atoms/types.ts:95](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/react/src/atoms/types.ts#L95)

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

Defined in: [packages/react/src/atoms/types.ts:93](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/react/src/atoms/types.ts#L93)

The registry result returned by defineAtomsRegistry.
