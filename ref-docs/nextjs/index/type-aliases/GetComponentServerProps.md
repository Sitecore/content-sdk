[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GetComponentServerProps

# Type Alias: GetComponentServerProps

> **GetComponentServerProps** = `ComponentPropsFetchFunction`

Defined in: [nextjs/src/sharedTypes/component-props.ts:41](https://github.com/Sitecore/content-sdk/blob/1f49f65949106a1df6f81df5c5e41772e45f913a/packages/nextjs/src/sharedTypes/component-props.ts#L41)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
