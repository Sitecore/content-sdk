import { createEditingConfigRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import components from '.sitecore/component-map';
import clientComponents from '.sitecore/component-map.client';
import metadata from '.sitecore/metadata.json';

/**
 * This API route is used by Sitecore Editor in XM Cloud
 * to determine feature compatibility and configuration.
 */

// Force dynamic rendering since this route uses request headers
export const dynamic = 'force-dynamic';

export const { GET, OPTIONS } = createEditingConfigRouteHandler({
  components,
  clientComponents,
  metadata,
});
