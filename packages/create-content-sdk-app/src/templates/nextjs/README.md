# Sitecore Content SDK Next.js Sample Application

<!---
@TODO: Update link with appropriate page when avaiable
-->

[Documentation](https://doc.sitecore.com/xmc/en/developers/xm-cloud/sitecore-javascript-rendering-sdk--jss--for-next-js.html)

## Next.js 16 Cache Components

Cache Components is **disabled by default** in this template. To enable it:

1. **Enable in `next.config.js`**:
   ```javascript
   const nextConfig = {
     cacheComponents: true,
     // ... rest of config
   };
   ```

2. **Add uncached data access** in all pages with `getStaticProps`:

   Next.js 16 with Cache Components requires accessing uncached data (`cookies()`, `headers()`, or `context.preview`) before any operations that might use `new Date()` or other time-related functions.

   Example:
   ```typescript
   export const getStaticProps: GetStaticProps = async (context) => {
     // Access uncached data first
     await cookies(); // or await headers(), or check context.preview

     // ... rest of getStaticProps
   };
   ```

   Apply this pattern to:
   - Pages that call `client.getPage()`, `client.getPreview()`, etc.
   - Error pages (404.tsx, 500.tsx) that call client methods
   - Any page with `getStaticProps` calling Sitecore client methods

3. **See the sample app** (`samples/nextjs`) for a working example with Cache Components enabled.