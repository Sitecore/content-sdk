[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / NextjsJssComponent

# Type Alias: NextjsJssComponent

> **NextjsJssComponent**: `ReactJssComponent` & `object`

Defined in: [nextjs/src/sharedTypes/component-props.ts:36](https://github.com/Sitecore/content-sdk/blob/49730513e5708f82afd41a071847a7598aa586bb/packages/nextjs/src/sharedTypes/component-props.ts#L36)

Represents a nextjs component import

## Type declaration

### dynamicModule()?

> `optional` **dynamicModule**: () => `Promise`\<`ReactJssComponent`\>

Optional dynamic import for lazy components - allows component props retrieval

#### Returns

`Promise`\<`ReactJssComponent`\>

### getServerSideProps?

> `optional` **getServerSideProps**: [`GetServerSideComponentProps`](GetServerSideComponentProps.md)

function for component level data fetching in SSR mode

### getStaticProps?

> `optional` **getStaticProps**: [`GetStaticComponentProps`](GetStaticComponentProps.md)

function for component level data fetching in SSG mode
