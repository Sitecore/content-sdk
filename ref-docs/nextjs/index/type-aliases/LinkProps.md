[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps**: `ReactLinkProps` & `object`

Defined in: [nextjs/src/components/Link.tsx:12](https://github.com/Sitecore/content-sdk/blob/324045ce9e3ff43e4201bd1e99d62939a4e8922a/packages/nextjs/src/components/Link.tsx#L12)

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
