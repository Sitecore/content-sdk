---
'@sitecore-content-sdk/core': patch
'@sitecore-content-sdk/react': patch
'@sitecore-content-sdk/angular': patch
---

Remove `javascript:` URLs from `RichText` and from `Text` when `encode` is false, in React and in the Angular `*scRichText` and `*scText` directives. The surrounding HTML and text stay in place, and a removed URL is logged when the field renders. The Angular `*scLink` and `*scRouterLink` directives also omit `javascript:` hrefs, matching the React `Link` component.
