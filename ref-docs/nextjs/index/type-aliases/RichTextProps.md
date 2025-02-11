[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / RichTextProps

# Type Alias: RichTextProps

> **RichTextProps**: `ReactRichTextProps` & `object`

Defined in: [nextjs/src/components/RichText.tsx:10](https://github.com/Sitecore/xmc-jss-dev/blob/ecfb4b66ff16c45f596cda74396c27d7d39de5a5/packages/nextjs/src/components/RichText.tsx#L10)

## Type declaration

### internalLinksSelector?

> `optional` **internalLinksSelector**: `string`

Selector which should be used in order to prefetch it and attach event listeners

#### Default

```ts
'a[href^="/"]'
```

### prefetchLinks?

> `optional` **prefetchLinks**: `boolean`

Controls the prefetch of internal links. This can be beneficial if you have RichText fields
with large numbers of internal links in them.

#### Default

```ts
true
```
