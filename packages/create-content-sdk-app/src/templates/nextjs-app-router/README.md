# Sitecore Content SDK Next.js App Router Sample Application

<!---
@TODO: Update link with appropriate page when avaiable
-->

[Documentation](https://doc.sitecore.com/xmc/en/developers/xm-cloud/sitecore-javascript-rendering-sdk--jss--for-next-js.html)

## Next.js Cache Components

Cache Components is **disabled by default** in this template. To enable it:

1. **Enable in `next.config.ts`**:
   ```typescript
   const nextConfig: NextConfig = {
     cacheComponents: true,
     // ... rest of config
   };
   ```

2. **Add uncached data access** in all server components that call client methods:
   
   Next.js 16 with Cache Components requires accessing uncached data (`draftMode()`, `cookies()`, `headers()`, or `searchParams`) before any operations that might use `new Date()` or other time-related functions.
   
   Example:
   ```typescript
   export default async function Page({ params, searchParams }: PageProps) {
     // Access uncached data first
     await draftMode();
     
     const { site, locale, path } = await params;
     // ... rest of component
   }
   ```
   
   Apply this pattern to:
   - Page components that call `client.getPage()`, `client.getPreview()`, etc.
   - `generateMetadata` functions
   - Layout components that call client methods
   - Not-found handlers
   - Any server component calling Sitecore client methods

3. **See the sample app** (`samples/nextjs-app-router`) for a working example with Cache Components enabled.
