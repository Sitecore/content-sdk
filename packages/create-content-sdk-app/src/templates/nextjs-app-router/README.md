# Sitecore Content SDK Next.js App Router Sample Application

<!---
@TODO: Update link with appropriate page when avaiable
-->

[Documentation](https://doc.sitecore.com/xmc/en/developers/xm-cloud/sitecore-javascript-rendering-sdk--jss--for-next-js.html)

## Next.js Cache Components

Cache Components is **disabled by default** in this template. 

**Quick Start:**
1. Enable `cacheComponents: true` in `next.config.ts`
2. Add uncached data access (`draftMode()`, `cookies()`, `headers()`, or `searchParams`) before calling client methods
3. Use Suspense boundaries for Partial Prerendering (PPR)

**Note:** Route handlers are not affected by Cache Components and require `export const dynamic = 'force-dynamic'` when using request headers/cookies.