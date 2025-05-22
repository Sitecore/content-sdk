[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / NextjsJssComponent

# Type Alias: NextjsJssComponent

> **NextjsJssComponent** = `ReactJssComponent` & `object`

Defined in: [nextjs/src/sharedTypes/component-props.ts:38](https://github.com/Sitecore/content-sdk/blob/edcc04a36ef7f57a72a1f7bbcbe6f0f4b5c25fc1/packages/nextjs/src/sharedTypes/component-props.ts#L38)

Represents a nextjs component import

## Type declaration

### dynamicModule()?

> `optional` **dynamicModule**: () => `Promise`\<`ReactJssComponent`\>

Optional dynamic import for lazy components - allows component props retrieval

#### Returns

`Promise`\<`ReactJssComponent`\>

### getComponentServerProps?

> `optional` **getComponentServerProps**: [`GetComponentServerProps`](GetComponentServerProps.md)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
