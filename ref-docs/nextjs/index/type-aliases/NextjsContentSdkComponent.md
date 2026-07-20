[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / NextjsContentSdkComponent

# Type Alias: NextjsContentSdkComponent

> **NextjsContentSdkComponent** = `ReactContentSdkComponent` & `object`

Defined in: [nextjs/src/sharedTypes/component-props.ts:47](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/nextjs/src/sharedTypes/component-props.ts#L47)

Represents a nextjs component import

## Type Declaration

### componentType?

> `optional` **componentType?**: `"client"` \| `"server"` \| `"universal"`

Indicates the type of the component in a Next.js app router context.
- 'client': The component contains client only api's and will be rendered on the client side.
- 'server': The component contains server only api's and will be rendered on the server side.
- 'universal': The component is isomorphic and can be rendered on both server and client.

### dynamicModule?

> `optional` **dynamicModule?**: () => `Promise`\<`ReactContentSdkComponent`\>

Optional dynamic import for lazy components - allows component props retrieval

#### Returns

`Promise`\<`ReactContentSdkComponent`\>

### getComponentServerProps?

> `optional` **getComponentServerProps?**: [`GetComponentServerProps`](GetComponentServerProps.md)

Defines the shape of a data-fetching function used at the component level.

This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
It enables component-specific data loading that integrates with Next.js rendering flows.

The returned props are passed directly to the component at render time.
