[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / RichTextProps

# Type Alias: RichTextProps

> **RichTextProps** = `ReactRichTextProps` & `object`

Defined in: [nextjs/src/components/RichText.tsx:14](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/nextjs/src/components/RichText.tsx#L14)

The interface for the RichText component props.

## Type Declaration

### internalLinksSelector?

> `optional` **internalLinksSelector?**: `string`

Selector which should be used in order to prefetch it and attach event listeners

#### Default

```ts
'a[href^="/"]'
```

### prefetchLinks?

> `optional` **prefetchLinks?**: `boolean` \| `"hover"`

Controls the prefetch of internal links. This can be beneficial if you have RichText fields
with large numbers of internal links in them.
- `true` (default): The full route & its data will be prefetched.
- `hover`: Prefetching will happen on hover.
- `false`: Prefetching will not happen.

#### Default

```ts
true
```
