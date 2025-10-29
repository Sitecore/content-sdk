[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GetComponentServerProps

# Type Alias: GetComponentServerProps

> **GetComponentServerProps** = `ComponentPropsFetchFunction`

Defined in: [nextjs/src/sharedTypes/component-props.ts:35](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/sharedTypes/component-props.ts#L35)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
