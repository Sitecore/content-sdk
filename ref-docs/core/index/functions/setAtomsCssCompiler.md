[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / setAtomsCssCompiler

# Function: setAtomsCssCompiler()

> **setAtomsCssCompiler**(`fn`): `void`

Defined in: [packages/core/src/atoms-css-compiler-registry.ts:36](https://github.com/Sitecore/content-sdk/blob/3e573fc42ab394415c9745258970d127cda84bbd/packages/core/src/atoms-css-compiler-registry.ts#L36)

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
