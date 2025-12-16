[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / LinkProps

# Type Alias: LinkProps

> **LinkProps** = `ReactLinkProps` & `object` & `Pick`\<`NextLinkProps`, *typeof* `supportedNextLinkProps`\[`number`\]\>

Defined in: [nextjs/src/components/Link.tsx:28](https://github.com/Sitecore/content-sdk/blob/6eb16655f677d9f2c9f82dbf67e6f8a92dd58ada/packages/nextjs/src/components/Link.tsx#L28)

The interface for the Link component props.

## Type Declaration

### internalLinkMatcher?

> `optional` **internalLinkMatcher**: `RegExp`

If `href` match with `internalLinkMatcher` regexp, then it's internal link and NextLink will be rendered

#### Default

```ts
/^//g
```
