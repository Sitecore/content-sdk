---
'@sitecore-content-sdk/core': minor
'@sitecore-content-sdk/react': minor
'@sitecore-content-sdk/nextjs': minor
'create-content-sdk-app': minor
---

Compile runtime Document `className` tokens into CSS so Atoms styles apply in Design Library editing and production rendering.

- Add a pluggable atoms CSS compiler registry (`setAtomsCssCompiler` / `getAtomsCssCompiler`)
- Tailwind integration via `registerTailwindCssCompiler` (explicit opt-in; no implicit fallback)
- Inject compiled CSS for Document classes in production RSC and Design Library preview
- Wire App Router starters with instrumentation, `compileCssAction`, and `serverExternalPackages`
