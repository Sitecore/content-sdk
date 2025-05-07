import { createRobotsHandler } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import scClient from 'lib/sitecore-client';

/**
 * API route for robots.txt
 */
export default createRobotsHandler({
  config: scConfig,
  siteResolver: (hostname) => scClient.resolveSite(hostname),
});