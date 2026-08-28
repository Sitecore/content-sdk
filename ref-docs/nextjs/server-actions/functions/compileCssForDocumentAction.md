[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [server-actions](../README.md) / compileCssForDocumentAction

# Function: compileCssForDocumentAction()

> **compileCssForDocumentAction**(`classes`): `Promise`\<`string`\>

Defined in: [nextjs/src/server-actions/compile-document-css-action.ts:31](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/nextjs/src/server-actions/compile-document-css-action.ts#L31)

Server Action that compiles CSS for a given set of class tokens extracted from an MMS
Document. Returns compiled CSS from the registered atoms compiler, or an empty string
when no compiler is registered.

Register a compiler via `setAtomsCssCompiler` / `registerTailwindCssCompiler` in
`instrumentation.ts` before using this action. The action does not default to Tailwind;
apps choose their compiler explicitly.

Intended to be passed as `atomsConfig.compileCssAction` in the app's `SitecoreProvider`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `classes` | `string`[] | Class tokens to compile. |

## Returns

`Promise`\<`string`\>

Compiled CSS, or empty string if no classes or no compiler.

## Example

```tsx
// instrumentation-node.ts
import { registerTailwindCssCompiler } from '@sitecore-content-sdk/nextjs/instrumentation';
await registerTailwindCssCompiler('src/app/globals.css');

// src/Providers.tsx  ('use client')
import { compileCssForDocumentAction } from '@sitecore-content-sdk/nextjs/server-actions';

<SitecoreProvider
  atomsConfig={{ catalog, registry, navigate, compileCssAction: compileCssForDocumentAction }}
/>
```
