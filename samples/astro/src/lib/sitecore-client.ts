import { SitecoreClient } from '@sitecore-content-sdk/astro';
import config from '../sitecore.config';

export const client = new SitecoreClient(config);
