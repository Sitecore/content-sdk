[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / setAtomsCssCompiler

# Function: setAtomsCssCompiler()

> **setAtomsCssCompiler**(`fn`): `void`

Defined in: [packages/core/src/atoms-css-compiler-registry.ts:34](https://github.com/Sitecore/content-sdk/blob/c876e4539ff3eeebb114160dc3159c5d1ae13766/packages/core/src/atoms-css-compiler-registry.ts#L34)

Registers the CSS compiler used by `StudioComponentServerWrapper` (production)
and `compileCssForDocumentAction` (editing) to generate CSS for class names
that exist only in runtime MMS Document JSON.

Call this in `instrumentation.ts` before the server handles any requests.
For Tailwind apps, prefer `registerTailwindCssCompiler` from
`@sitecore-content-sdk/nextjs/instrumentation`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | [`AtomsCssCompiler`](../type-aliases/AtomsCssCompiler.md) | Async function that accepts class tokens and returns compiled CSS. |

## Returns

`void`
