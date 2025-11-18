[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GetComponentServerProps

# Type Alias: GetComponentServerProps

> **GetComponentServerProps** = `ComponentPropsFetchFunction`

Defined in: [nextjs/src/sharedTypes/component-props.ts:41](https://github.com/Sitecore/content-sdk/blob/4867cc2c17164b3451c55daacc6edef1f1f5d463/packages/nextjs/src/sharedTypes/component-props.ts#L41)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
