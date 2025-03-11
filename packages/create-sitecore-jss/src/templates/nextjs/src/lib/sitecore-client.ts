import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import { moduleFactory } from 'temp/componentBuilder';

const client = new SitecoreClient({
  sites,
  moduleFactory,
  ...scConfig,
});

export default client;
