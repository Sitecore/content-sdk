import { SitemapMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import scClient from 'lib/sitecore-client';
import sites from '.sitecore/sites.json';

const handler = new SitemapMiddleware(scClient, sites).getHandler();

export default handler;
