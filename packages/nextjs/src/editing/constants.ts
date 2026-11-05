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
 * Header used to forward the already-validated editing secret from the editing
 * render handler/middleware to the internal Next.js page or server-action request.
 * Do not put this value in `EDITING_PARAMS_HEADER` JSON.
 */
export const EDITING_SECRET_HEADER = 'x-sitecore-editing-secret';
