[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps**: `ReactLinkProps` & `object`

Defined in: [nextjs/src/components/Link.tsx:10](https://github.com/Sitecore/content-sdk/blob/cd9c0186a1ca632e03848e7eccc9c082c9a03341/packages/nextjs/src/components/Link.tsx#L10)

## Type declaration

### internalLinkMatcher?

> `optional` **internalLinkMatcher**: `RegExp`

If `href` match with `internalLinkMatcher` regexp, then it's internal link and NextLink will be rendered

#### Default

```ts
/^//g
```

### prefetch?

> `optional` **prefetch**: `NextLinkProps`\[`"prefetch"`\]

Next.js Link prefetch.
