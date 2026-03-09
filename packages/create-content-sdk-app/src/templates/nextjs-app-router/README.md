# Sitecore Content SDK Next.js App Router Sample Application

<!---
@TODO: Update link with appropriate page when avaiable
-->

[Documentation](https://doc.sitecore.com/xmc/en/developers/xm-cloud/sitecore-javascript-rendering-sdk--jss--for-next-js.html)

## Next.js Cache Components

Cache Components is **disabled by default** in this template. The app runs without Suspense boundaries around page, layout, or not-found content.

If you enable **Next.js 16 Cache Components** (`cacheComponents: true` in `next.config.ts`), you must add `<Suspense>` boundaries (or use `"use cache"`) around any component that accesses uncached request-time data (`draftMode()`, `headers()`, `cookies()`, or `searchParams`). See [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) and the "Uncached data was accessed outside of `<Suspense>`" docs for details.
