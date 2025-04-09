[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps**: `ReactLinkProps` & `object`

Defined in: [nextjs/src/components/Link.tsx:12](https://github.com/Sitecore/content-sdk/blob/b152c3f4a50979a3ba0fb00ad2bfcb4012268c4d/packages/nextjs/src/components/Link.tsx#L12)

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
