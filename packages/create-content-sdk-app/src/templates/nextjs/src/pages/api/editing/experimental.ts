import { ExperimentalFeaturesMiddleware } from '@sitecore-content-sdk/nextjs/editing';

/**
 * This Next.js API route exposes available experimental Content SDK features
 * (and whether each is enabled) for Sitecore AI / editing host consumers.
 * Protected by the Sitecore editing secret, same as /api/editing/config.
 *
 * GET /api/editing/experimental?secret=...
 */

const handler = new ExperimentalFeaturesMiddleware().getHandler();

export default handler;
