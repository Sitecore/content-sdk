[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / RichTextProps

# Type Alias: RichTextProps

> **RichTextProps** = `ReactRichTextProps` & `object`

Defined in: [nextjs/src/components/RichText.tsx:14](https://github.com/Sitecore/content-sdk/blob/5d6b10bbee4bce6e575bd048c07d2ee0751ac361/packages/nextjs/src/components/RichText.tsx#L14)

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
