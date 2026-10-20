---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': minor
'@sitecore-content-sdk/angular': minor
'create-content-sdk-app': minor
---

[content][nextjs][angular] Add Dynamic Content Tokens

Authors can place `{{key}}` and `{{key|fallback}}` tokens in page content, and personalized renders replace them with the values returned by the Personalize execution. Turn it on with `personalize: { dynamicContent: true }` in `sitecore.config`. It is off by default, so upgrading changes nothing until you enable it.

- `getPage` resolves tokens in the route right after personalization, in the same pass as the media URL rewrite. Pass the request's values with `getPage(path, { tokens })`. Without them, tokens render their fallback. A token with no value and no fallback is removed, and `{{...}}` text that is not a valid token key (for example `{{#each items}}` or `{{{body}}}`) is left as authored.
- Values are inserted as text only. They are HTML-escaped in markup, and inside tags only the fallback is used. Comments and `<script>`, `<style>`, `<pre>`, `<code>` and `<textarea>` are left as authored. In URLs (`href`, `src`, `url`, `srcSet`, or a string that is entirely a URL), values are percent-encoded and unsafe results fall back.
- Preview, Design Library and error pages are never processed.
- Next.js: `PersonalizeProxy` forwards tokens in the `x-sc-personalize-tokens` request header and adds a `_sctokens` segment to the rewrite path (`hasPersonalizeTokensRewrite(path)`). It always removes an inbound `x-sc-personalize-tokens` header, and responses that carry tokens get `Cache-Control: private, no-store`. Use `getPersonalizeTokens(path, getHeaders)` to read the tokens; it reads headers only on token requests. SSR pages render visitor values. With Cache Components, token requests render at request time inside `<Suspense>` and every other page stays prerendered. Other statically generated pages (Pages Router `getStaticProps`, App Router without Cache Components) cannot read request headers, so they render fallbacks.
- Angular: the personalize middleware forwards tokens in the same header, and `getPersonalizeTokens(context)` reads them in loaders. Requests with tokens skip the loader cache and respond with `Cache-Control: private, no-store`.
- Tokens are collected from every successful Personalize execution, including the default branch.

Starters enable `dynamicContent` and pass `tokens` on published renders: Pages Router and App Router in SSR mode, App Router with Cache Components (token requests render inside `<Suspense>` and outside `'use cache'`), and the Angular page loader.

**Existing apps:** set `personalize.dynamicContent: true`, keep `PersonalizeProxy` / `createPersonalizeMiddleware` in the request chain, and pass `tokens: await getPersonalizeTokens(path, ...)` (Next.js) or `tokens: getPersonalizeTokens(context)` (Angular) to `getPage`. Once enabled, `{{key}}` text in route content is processed, so check existing content for literal `{{...}}` text.
