/**
 * Request header carrying the middleware-resolved Content SDK request params
 * (site name, variant ids, and trusted `tokens`) from Express middlewares to
 * the loader pipeline. This is a request header and may contain visitor PII;
 * do not log the payload. Custom Express request properties don't survive
 * Angular's conversion of the incoming request to a web `Request` (the SSR
 * `REQUEST` token), so the params also ride this header — the same mechanism
 * `x-sitecore-editing-params` uses.
 * @public
 */
export const SC_PARAMS_HEADER = 'x-sitecore-params';
