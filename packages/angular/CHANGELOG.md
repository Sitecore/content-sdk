# @sitecore-content-sdk/angular

## 0.2.0

### Minor Changes

- Add loader prefetch for `scRouterLink`/`scRichText` links, so route data is already loaded by the time a user navigates. ([84866de](https://github.com/sitecore/content-sdk/commit/84866ded66f6f8f69e7f007b2311494e086b493b))

  Controlled per-link via each directive's `prefetch` input, or globally via `sitecore.config`'s `angular.linkPrefetch`:

  - `'eager'` (default) — prefetch as soon as the link renders.
  - `'hover'` — defer prefetching until the pointer dwells on the link for `angular.linkPrefetch.delayMs` (default 100ms).
  - `'off'` — never prefetch.

- Support optional `sc_previewTime` on the Angular editing render endpoint for time-based Edge preview. ([8b18c6e](https://github.com/sitecore/content-sdk/commit/8b18c6e6c2cc3546028f5408655ca263435d7507))
- Bot tracking support for Angular ([4c907d5](https://github.com/sitecore/content-sdk/commit/4c907d5f6aac9870a7c40fd993f1f70ddce4802f))
  - Expose `createBotTrackingMiddleware` function that creates an Express middleware for identifying bot requests
- SXA Redirects support in Angular ([07c6169](https://github.com/sitecore/content-sdk/commit/07c6169d94098a2bc2f491ef61de4d253b52b098))

### Patch Changes

- [Chore] Cleanup demo code ([758194c](https://github.com/sitecore/content-sdk/commit/758194c5352b02735bc7dfd29f021597ce763889))

## 0.1.0

### Minor Changes

- Inital Angular support for Content SDK and Sitecore AI ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
  - Basic rendering and skate-park sample app
  - Internalization
  - Multisite
  - Personalization and analytics page view events support
  - Stale-while-revalidate data caching (find more in documentation)
  - Editing and Preview
  - Sitemap and robots.txt enpoints support
  - Component-level Angular guards

### Patch Changes

- Correct siteName resolution in preview mode ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
- Fix preview detection, rely on headers instead of cookies for preview ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
