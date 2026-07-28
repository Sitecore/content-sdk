import type { analyticsServerAdapter } from '@sitecore-content-sdk/analytics-core';
import type { ExpressRequest, ExpressResponse } from './models';

/**
 * Server adapter request/response types derived from {@link analyticsServerAdapter}.
 * Avoids importing `@types/node` at middleware call sites that use {@link CsdkExpressRequest}.
 */
export type NodeAdapterRequest = Parameters<typeof analyticsServerAdapter>[0];
export type NodeAdapterResponse = Parameters<typeof analyticsServerAdapter>[1];

/**
 * Express req/res are Node `IncomingMessage`/`ServerResponse` at runtime; cast for cookie adapters.
 * @param {ExpressRequest} req - Content SDK Express request
 * @param {ExpressResponse} res - Content SDK Express response
 * @returns {NodeAdapterRequest & NodeAdapterResponse} The Node adapter request and response
 */
export function toNodeAdapterPair(
  req: ExpressRequest,
  res: ExpressResponse
): { req: NodeAdapterRequest; res: NodeAdapterResponse } {
  return {
    req: req as unknown as NodeAdapterRequest,
    res: res as unknown as NodeAdapterResponse,
  };
}
