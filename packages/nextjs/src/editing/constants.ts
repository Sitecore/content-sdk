export const QUERY_PARAM_VERCEL_PROTECTION_BYPASS = 'x-vercel-protection-bypass';
export const QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE = 'x-vercel-set-bypass-cookie';

/**
 * Headers that should be passed along to (Editing Chromes handler) SSR request.
 * Note these are in lowercase format to match expected `IncomingHttpHeaders`.
 */
export const EDITING_PASS_THROUGH_HEADERS = ['authorization', 'cookie'];

/**
 * Header used to propagate editing preview parameters from the editing render
 * route handler to the Next.js page when running in App Router.
 */
export const EDITING_PARAMS_HEADER = 'x-sitecore-editing-params';

/**
 * Lifetime, in seconds, of the Next.js preview cookies issued for an editing or Design Library
 * render. These only need to survive the single internal render request.
 */
export const EDITING_RENDER_PREVIEW_MAX_AGE = 3;

/**
 * Default lifetime, in seconds, of the Next.js preview cookies issued for a Sitecore Preview
 * session in the Pages Router.
 *
 * Preview is a browsing session rather than a single render: the author follows links after the
 * initial render, and every one of those requests has to keep bypassing the static cache and
 * keep carrying the session scoped preview parameters.
 */
export const PREVIEW_SESSION_MAX_AGE = 60 * 60;
