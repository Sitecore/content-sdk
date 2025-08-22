export const QUERY_PARAM_VERCEL_PROTECTION_BYPASS = 'x-vercel-protection-bypass';
export const QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE = 'x-vercel-set-bypass-cookie';

/**
 * Feature flag to enable/disable the new Option 4 "internal forward" approach.
 *
 * - When false (default): Editing render handlers fall back to the legacy behavior
 *   (set preview cookies on the browser + redirect to the page).
 * - When true: Editing render handlers use an internal server-side fetch to
 *   render the requested page, scoped only to that request, and never leak
 *   preview cookies to the browser.
 *
 * This flag ensures the change is non-breaking and can be rolled out gradually.
 */
export const EDITING_FORWARD_ENABLED =
  String(process.env.EDITING_FORWARD_ENABLED ?? 'false').toLowerCase() === 'true';

/**
 * Base URL used for the internal forward request in Option 4.
 *
 * - Example: "http://localhost:3000" in local dev.
 * - If empty, the middleware falls back to using the incoming request's host
 *   (public hop). That works, but is less efficient.
 * - Only http/https protocols are allowed (guarded by EDITING_INTERNAL_HOST_ALLOWED_PROTOCOLS).
 *
 * This setting optimizes performance by avoiding unnecessary network hops
 * when the Editing Host is available directly on the same machine/network.
 */
export const EDITING_INTERNAL_HOST_URL = String(process.env.EDITING_INTERNAL_HOST_URL ?? '');

/**
 * Allowed URL protocols for EDITING_INTERNAL_HOST_URL.
 * This guards against SSRF by ensuring we only ever forward requests
 * to http(s) URLs, never file://, ftp://, etc.
 */
export const EDITING_INTERNAL_HOST_ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);


/**
 * Headers that should be passed along to (Editing Chromes handler) SSR request.
 * Note these are in lowercase format to match expected `IncomingHttpHeaders`.
 */
export const EDITING_PASS_THROUGH_HEADERS = ['authorization', 'cookie'];
