import { IncomingMessage } from 'http';
import { Request, RequestHandler } from 'express';
import { AppRenderer } from '../../types/AppRenderer';
import { RouteUrlParser } from '../../types/RouteUrlParser';
import { ProxyConfig, ServerBundle } from './ProxyConfig';
export declare const removeEmptyAnalyticsCookie: (proxyResponse: IncomingMessage) => void;
/**
 * @param {string} reqPath
 * @param {Request} req
 * @param {ProxyConfig} config
 * @param {RouteUrlParser} parseRouteUrl
 */
export declare function rewriteRequestPath(reqPath: string, req: Request, config: ProxyConfig, parseRouteUrl?: RouteUrlParser): string;
/**
 * @param {AppRenderer} renderer
 * @param {ProxyConfig} config
 * @param {RouteUrlParser} parseRouteUrl
 */
export declare function middleware(renderer: AppRenderer, config: ProxyConfig, parseRouteUrl: RouteUrlParser): RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
export { ProxyConfig, ServerBundle };
