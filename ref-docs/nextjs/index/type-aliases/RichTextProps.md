[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / RichTextProps

# Type Alias: RichTextProps

> **RichTextProps** = `ReactRichTextProps` & `object`

Defined in: [nextjs/src/components/RichText.tsx:8](https://github.com/Sitecore/content-sdk/blob/ccaca47e1d3be54d4807fac59220b223d5ccd97e/packages/nextjs/src/components/RichText.tsx#L8)

## Type declaration

### internalLinksSelector?

> `optional` **internalLinksSelector**: `string`

Selector which should be used in order to prefetch it and attach event listeners

#### Default

```ts
'a[href^="/"]'
```

### prefetchLinks?

> `optional` **prefetchLinks**: `boolean` \| `"hover"`

Controls the prefetch of internal links. This can be beneficial if you have RichText fields
with large numbers of internal links in them.
- `true` (default): The full route & its data will be prefetched.
- `hover`: Prefetching will happen on hover.
- `false`: Prefetching will not happen.

#### Default

```ts
true
```
