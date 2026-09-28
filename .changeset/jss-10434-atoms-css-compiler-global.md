---
'@sitecore-content-sdk/core': patch
'create-content-sdk-app': patch
---

Store the atoms CSS compiler on `globalThis` under a `Symbol.for` key so every server bundle shares one registry.

Next.js builds instrumentation, RSC, and Server Actions separately, so a module-level variable gave each bundle its own compiler. Apps worked around this by listing `@sitecore-content-sdk/core` in `serverExternalPackages`, which forced a single instance but also sent the package through Node's native ESM loader. The registry no longer depends on how the package is loaded, and `@sitecore-content-sdk/core` has been removed from `serverExternalPackages` in the App Router starters (`@tailwindcss/node` stays, since its native binaries cannot be bundled).

`setAtomsCssCompiler` and `getAtomsCssCompiler` are unchanged.
