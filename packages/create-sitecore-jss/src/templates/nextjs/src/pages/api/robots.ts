import { RobotsMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import scClient from 'lib/sitecore-client';

const handler = new RobotsMiddleware(scClient).getHandler();

export default handler;
