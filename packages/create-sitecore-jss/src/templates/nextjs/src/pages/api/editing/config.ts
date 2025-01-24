import { EditingConfigMiddleware } from '@xmcloud-jss/sitecore-jss-nextjs/editing';
import { components } from 'temp/componentBuilder';
import metadata from 'temp/metadata.json';

/**
 * This Next.js API route is used by Sitecore Editor in XM Cloud
 * to determine feature compatibility and configuration.
 */

const handler = new EditingConfigMiddleware({
  components,
  metadata,
}).getHandler();

export default handler;
