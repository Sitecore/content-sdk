import { createEditingRenderRouteHandlers } from '@sitecore-content-sdk/nextjs/route-handler';
import { NextRequest } from 'next/server';

/**
 * API route to handler Sitecore Editor rendeing.
 * When using custom server URL, it should match the rendering host from your Sitecore configuration,
 * (see the settings item under /sitecore/content/<your/site/path>/Settings/Site Grouping).
 *
 * The route handler will:
 *  1. Extract data about the route we need to render from the Sitecore Editor GET request
 *  2. Enable Next.js Draft Mode
 *  3. Pass preview data as query string parameters, alongside required headers and cookies to an internal editing request
 *  4. Return the rendered HTML for editing mode
 *
 * The wrapper below ensures all editing cookies carry SameSite=None; Secure so
 * browsers allow them inside the cross-origin XM Cloud editor iframe.
 */

// Force dynamic rendering since this route uses request headers, cookies, and draftMode
export const dynamic = 'force-dynamic';

/** Cookie name prefixes that belong to Sitecore editing or Next.js preview */
const EDITING_COOKIE_PREFIXES = [
  '__prerender_bypass',
  '__next_preview_data',
  'sc_mode',
  'sc_headless_mode',
  'sc_preview',
  'sc_cid',
  'sc_cid_personalize',
  'sc_site',
];

function isEditingCookie(cookieStr: string): boolean {
  const name = cookieStr.trimStart().split('=')[0];
  return (
    EDITING_COOKIE_PREFIXES.some((prefix) => name === prefix) ||
    name.includes('#sc_')
  );
}

function patchSameSite(setCookieValue: string): string {
  let patched = setCookieValue
    .replace(/;\s*SameSite=\w+/gi, '')
    .replace(/;\s*Secure/gi, '');
  return `${patched}; SameSite=None; Secure`;
}

function patchResponseCookies(response: Response): Response {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies.length) return response;

  const headers = new Headers(response.headers);
  headers.delete('Set-Cookie');

  for (const cookie of setCookies) {
    headers.append('Set-Cookie', isEditingCookie(cookie) ? patchSameSite(cookie) : cookie);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const handlers = createEditingRenderRouteHandlers({});

export const OPTIONS = handlers.OPTIONS;

export async function GET(req: NextRequest) {
  const response = await handlers.GET(req);
  return patchResponseCookies(response);
}

export async function POST(req: NextRequest) {
  const response = await handlers.POST(req);
  return patchResponseCookies(response);
}
