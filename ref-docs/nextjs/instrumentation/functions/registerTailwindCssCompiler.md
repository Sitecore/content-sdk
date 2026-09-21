[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [instrumentation](../README.md) / registerTailwindCssCompiler

# Function: registerTailwindCssCompiler()

> **registerTailwindCssCompiler**(`cssFilePath?`): `Promise`\<`void`\>

Defined in: [nextjs/src/instrumentation/index.ts:23](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/nextjs/src/instrumentation/index.ts#L23)

Compiles Tailwind CSS from the app's main stylesheet and registers the result as the
atoms CSS compiler (via `setAtomsCssCompiler`) so that class names that exist only in
runtime MMS Document JSON get compiled and injected at request time.

Intended to be called once at server startup from a Node.js-only
`instrumentation-node.ts` file (imported conditionally from `instrumentation.ts` when
`NEXT_RUNTIME === 'nodejs'`). Compiled CSS is cached per class-set; each cache miss
uses a fresh Tailwind `compile()` so previously used classes are not retained.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `cssFilePath?` | `string` | `DEFAULT_ATOMS_CSS_FILE` | Path to the app's main CSS file (e.g. `src/app/globals.css`), relative to `process.cwd()` or absolute. Defaults to `DEFAULT_ATOMS_CSS_FILE`. |

## Returns

`Promise`\<`void`\>

Resolves once the compiler has been created and registered.
