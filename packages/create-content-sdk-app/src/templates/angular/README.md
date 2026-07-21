# Content SDK Angular sample - beta

This is a sample for pre-release of Content SDK Angular for Sitecore AI. It contains all the required components and pre-sets for the skate-park sample site in Sitecore and can serve as a good starting point for any custom implementation.
The functionality available in Content SDK Angular right now includes:
 - Basic rendering and field components
 - Initernalization support
 - Editing and Preview support
 - Multisite
 - Sitemap, robots.txt endpoints

What can you expect coming in the future ahead of the 1.0 release:
 - SXA Redirects support
 - Ongoing optimizations and bug fixes

## Deployment

### Deploying to Sitecore AI

The regular deployment to SAI follows the usual flow:
- Follow the prompts in the SAI Deploy portal
- Connect your GitHub repository with the Content SDK Angular sample

But, temporarily, we ask you to perform some additional actions post-deploy in your Editing Host instance:
- Go to the `Variables` section and specify the following environment variables:
  - CSDK_PUBLIC_SITECORE_EDGE_CONTEXT_ID=id-from-authoring-here
  - CSDK_PUBLIC_SITECORE_DEFAULT_SITE=your-site-name
  - CSDK_PUBLIC_SITECORE_DEFAULT_LANGUAGE=your-language
  - NG_TRUST_PROXY_HEADERS=X-FORWARDED-PORT,X-FORWARDED-PATH,X-FORWARDED-FOR,X-FORWARDED-HOST,X-FORWARDED-PROTO
  - NG_ALLOWED_HOSTS=*.sitecorecloud.io
- Redeploy the editing host

These variables are needed to ensure SAI backend infrastructure correctly sets up and uses your Angular sample for Pages editing and preview. They will be switched to be set automatically between now and the 1.0 release.

## Non-Sitecore AI deployments

For both deploying to Netlify and Vercel, ensure your `src/server.ts` file has the default export for the request handler:
```
  export default reqHandler;
```

### Deploying to Vercel

Content SDK for Angular sample uses ExpressJS extensively to enhance the base Angular capabilities with Sitecore AI features.
Since Express is being used, and since Vercel has no Angular SSR support, you need to create a Vercel function file in order for Vercel to correctly serve the application.
For example, create a `vercel/index.mjs` file and import the Angular's compiled `server.mjs`output:
```
  export { default } from '../dist/<your_app_name>/server/server.mjs';
```
where `<your_app_name>` is the name of application set in `package.json`.

After that, configure redirect rules for Vercel request to reach your app code, via `vercel.json` file:
```
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist/<your_app_name>/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/vercel/index"
    }
  ],
  "functions": {
    "vercel/index.mjs": {
      "includeFiles": "dist/<your_app_name>/**"
    }
  }
}
```

3. In Vercel portal, set the required Content SDK environment variables. Additionally, set `NG_ALLOWED_HOSTS` environment variable to allow Vercel URLs:
```
  NG_ALLOWED_HOSTS=*.vercel.app`
```

Deploying your app to Vercel should now result in the site being correctly served.

### Deploying to Netlify

As ExpressJS is being used by Content SDK for Angular, the natural instinct would be to follow the [express guide from Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/#deploy-your-express-app-with-netlify-cli)
Unfortunately, this will result in your Netlify functions being compiled as CJS and some built in functionality of Angular (like `import.meta` values) being unavailable.
In order to build the function with Netlify's latest v2 API and have it compiled as ESM, some hoop jumps are required, using the express deployment guide as basis.

1. `serverless-http` module provides the required bridge between Express and Netlify, so you should install it alongside few additional dependencies that your Netlify function will use:
```
  npm i express serverless-http @netlify/functions @types/express
```
2. Create a function implementation file that will import Angular's SSR artifacts and transform them to be used by `serverless-http` and v2 functions. These transformations are needed for Netlify CLI to correctly identify the function as ESM-compatible. The below example is for a TypeScript implementaion. We assume this function is located in the `netlify/functions/server.mts` file:
```
import serverless from 'serverless-http';
import type { Context } from '@netlify/functions';
import { default as app } from '../../dist/<your_app_name>/server/server.mjs';

const handler = serverless(app);
const FUNCTION_BASE = '/.netlify/functions/server';

/** serverless-http's result for a Lambda Function URL ("2.0") event. */
interface LambdaResult {
  statusCode: number;
  headers: Record<string, string>;
  cookies: string[];
  body: string;
  isBase64Encoded: boolean;
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  // The netlify.toml rewrite passes the original path; direct invocations
  // arrive prefixed with the function base path — strip it.
  const path = url.pathname.startsWith(FUNCTION_BASE)
    ? url.pathname.slice(FUNCTION_BASE.length) || '/'
    : url.pathname;

  // Lambda Function URL ("2.0") event — the leanest shape serverless-http accepts
  const lambdaRequest = {
      version: '2.0',
      rawPath: path,
      rawQueryString: url.searchParams.toString(),
      headers: Object.fromEntries(request.headers),
      requestContext: { http: { method: request.method } },
      body: Buffer.from(await request.arrayBuffer()),
    };
  const result = (await handler(lambdaRequest, context)) as LambdaResult;

  // set-cookie comes back separately; `|| null` keeps 204/304 responses body-less.
  const headers = new Headers(result.headers);
  for (const cookie of result.cookies) headers.append('set-cookie', cookie);
  return new Response(
    result.isBase64Encoded ? Buffer.from(result.body, 'base64') : result.body || null,
    { status: result.statusCode, headers }
  );
};
```
where `<your_app_name>` is the name of application set in `package.json`.

3. Finally, create the `netlify.toml` file to correctly configure Netlify in handling request to your function:
```
[build]
  command = "npm run build"
  publish = "dist/content-sdk-angular/browser"

[functions.server]
  # Ship the full dist folder so express.static and any runtime file access work.
  included_files = ["dist/content-sdk-angular/**"]

[[redirects]]
  from = "/*"
  status = 200
  to = "/.netlify/functions/server/:splat"

```

4. In Netlify portal, set the required Content SDK environment variables. Additionally, set `NG_ALLOWED_HOSTS` environment variable to allow netlify URLs:
```
  NG_ALLOWED_HOSTS=*.netlify.app`
```
