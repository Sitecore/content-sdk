[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GetComponentServerProps

# Type Alias: GetComponentServerProps

> **GetComponentServerProps** = `ComponentPropsFetchFunction`

Defined in: [nextjs/src/sharedTypes/component-props.ts:35](https://github.com/Sitecore/content-sdk/blob/0c888a2fdb81890effd584a22eba80368bdbff2c/packages/nextjs/src/sharedTypes/component-props.ts#L35)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
