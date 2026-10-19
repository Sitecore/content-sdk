/**
 * Request header carrying the middleware-resolved Content SDK request params
 * (site name, variant ids) from Express middlewares to the loader pipeline.
 * Custom Express request properties don't survive Angular's conversion of the
 * incoming request to a web `Request` (the SSR `REQUEST` token), so the params
 * also ride this header — the same mechanism `x-sitecore-editing-params` uses.
 * @public
 */
export const SC_PARAMS_HEADER = 'x-sitecore-params';
