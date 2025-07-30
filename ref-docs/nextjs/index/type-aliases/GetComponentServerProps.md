[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GetComponentServerProps

# Type Alias: GetComponentServerProps

> **GetComponentServerProps** = `ComponentPropsFetchFunction`

Defined in: [nextjs/src/sharedTypes/component-props.ts:33](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/nextjs/src/sharedTypes/component-props.ts#L33)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
