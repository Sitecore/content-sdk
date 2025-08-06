[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GetComponentServerProps

# Type Alias: GetComponentServerProps

> **GetComponentServerProps** = `ComponentPropsFetchFunction`

<<<<<<< HEAD
Defined in: [nextjs/src/sharedTypes/component-props.ts:33](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/sharedTypes/component-props.ts#L33)
=======
Defined in: [nextjs/src/sharedTypes/component-props.ts:33](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/sharedTypes/component-props.ts#L33)
>>>>>>> dd686bb50 (Update API docs)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
