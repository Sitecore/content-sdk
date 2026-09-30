import { createExperimentalFeaturesRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';

/**
 * This API route exposes available experimental Content SDK features
 * (and whether each is enabled) for Sitecore AI / editing host consumers.
 * Protected by the Sitecore editing secret, same as /api/editing/config.
 *
 * GET /api/editing/experimental?secret=...
 */

export const { GET, OPTIONS } = createExperimentalFeaturesRouteHandler();
