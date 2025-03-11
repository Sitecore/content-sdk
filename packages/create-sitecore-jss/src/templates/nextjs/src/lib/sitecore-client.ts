import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';

const client = new SitecoreClient({
  sites,
  ...scConfig,
});

export default client;
