/**
 * Vercel Edge Middleware for Sitecore Content SDK Angular applications.
 *
 * This middleware runs at Vercel's Edge network before requests hit the SSR function.
 * It's ideal for:
 * - Personalization (A/B testing, targeted content)
 * - Multisite hostname resolution
 * - Geolocation-based routing
 * - Redirects
 * - Header manipulation
 *
 * To enable middleware:
 * 1. Customize this file for your needs
 * 2. Run `npm run build:vercel` to build with middleware support
 * 3. Deploy with `vercel deploy --prebuilt`
 *
 * @see https://vercel.com/docs/edge-middleware
 */

// Site configuration - should match your sites.json
interface SiteInfo {
  name: string;
  hostName: string;
  language: string;
}

// Import sites configuration (adjust path as needed)
// Note: For Edge runtime, you may need to inline this or use a different import strategy
const sites: SiteInfo[] = [
  {
    name: 'website',
    hostName: 'localhost',
    language: 'en',
  },
  // Add more sites as needed
];

/**
 * Paths that should skip middleware processing
 */
const SKIP_PATHS = [
  '/_next',
  '/api',
  '/_data',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

/**
 * File extensions that should skip middleware processing
 */
const STATIC_FILE_EXTENSIONS = [
  '.js',
  '.css',
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.webp',
  '.avif',
  '.json',
  '.map',
];

/**
 * Check if the request path should skip middleware
 */
function shouldSkip(pathname: string): boolean {
  // Skip internal paths
  if (SKIP_PATHS.some((path) => pathname.startsWith(path))) {
    return true;
  }

  // Skip static files
  if (STATIC_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
    return true;
  }

  return false;
}

/**
 * Get site info based on hostname
 */
function getSiteByHostname(hostname: string): SiteInfo | undefined {
  return sites.find((site) => {
    const siteHostname = site.hostName.toLowerCase();
    const requestHostname = hostname.toLowerCase();

    // Exact match
    if (siteHostname === requestHostname) {
      return true;
    }

    // Wildcard match (e.g., *.example.com)
    if (siteHostname.startsWith('*.')) {
      const domain = siteHostname.slice(2);
      return requestHostname.endsWith(domain);
    }

    return false;
  });
}

/**
 * Vercel Edge Middleware handler
 *
 * This function runs on every request before it reaches the origin.
 * Use it to implement personalization, redirects, rewrites, or header manipulation.
 */
export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname, hostname } = url;

  // Skip middleware for static assets and internal paths
  if (shouldSkip(pathname)) {
    return fetch(request);
  }

  // Resolve site based on hostname
  const site = getSiteByHostname(hostname);

  // Create response headers for site context
  const responseHeaders = new Headers();

  if (site) {
    // Add site context headers for downstream processing
    responseHeaders.set('x-sc-site', site.name);
    responseHeaders.set('x-sc-language', site.language);
  }

  // Example: Geolocation-based personalization
  // Vercel provides geo data automatically at the edge
  // const geo = request.headers.get('x-vercel-ip-country');
  // if (geo) {
  //   responseHeaders.set('x-sc-geo-country', geo);
  // }

  // Example: A/B Testing / Feature Flags
  // const abTestCookie = request.headers.get('cookie')?.match(/ab_test=([^;]+)/)?.[1];
  // if (!abTestCookie) {
  //   // Assign user to a variant
  //   const variant = Math.random() < 0.5 ? 'A' : 'B';
  //   responseHeaders.set('Set-Cookie', `ab_test=${variant}; Path=/; HttpOnly; SameSite=Lax`);
  // }

  // Example: Redirect based on conditions
  // if (pathname === '/old-page') {
  //   return Response.redirect(new URL('/new-page', request.url), 301);
  // }

  // Example: Rewrite to a different path (invisible to the user)
  // if (pathname.startsWith('/blog/') && site?.name === 'marketing') {
  //   const rewriteUrl = new URL(request.url);
  //   rewriteUrl.pathname = `/sites/marketing${pathname}`;
  //   return fetch(new Request(rewriteUrl, request));
  // }

  // Continue to the origin with modified headers
  const response = await fetch(request);

  // Clone the response to modify headers
  const newResponse = new Response(response.body, response);

  // Add custom headers to the response
  responseHeaders.forEach((value, key) => {
    newResponse.headers.set(key, value);
  });

  return newResponse;
}

/**
 * Configure which paths the middleware should run on.
 * This is optional but recommended for performance.
 *
 * @see https://vercel.com/docs/edge-middleware/middleware-api#config
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
