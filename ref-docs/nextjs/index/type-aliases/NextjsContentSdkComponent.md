[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / NextjsContentSdkComponent

# Type Alias: NextjsContentSdkComponent

> **NextjsContentSdkComponent** = `ReactContentSdkComponent` & `object`

Defined in: [nextjs/src/sharedTypes/component-props.ts:38](https://github.com/Sitecore/content-sdk/blob/a01cc44e1fcc542a3a9ccd722895979634ef9b0a/packages/nextjs/src/sharedTypes/component-props.ts#L38)

Represents a nextjs component import

## Type declaration

### dynamicModule()?

> `optional` **dynamicModule**: () => `Promise`\<`ReactContentSdkComponent`\>

Optional dynamic import for lazy components - allows component props retrieval

#### Returns

`Promise`\<`ReactContentSdkComponent`\>

### getComponentServerProps?

> `optional` **getComponentServerProps**: [`GetComponentServerProps`](GetComponentServerProps.md)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
