import { EditingConfigMiddleware } from '@sitecore-content-sdk/nextjs/editing';
import components from '.sitecore/component-map';
import metadata from '.sitecore/metadata.json';

/**
 * This Next.js API route is used by Sitecore Editor in XM Cloud
 * to determine feature compatibility and configuration.
 */

const handler = new EditingConfigMiddleware({
  components,
  metadata,
}).getHandler();

export default handler;
