import { SitemapMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import scClient from 'lib/sitecore-client';

const handler = new SitemapMiddleware(scClient).getHandler();

export default handler;
