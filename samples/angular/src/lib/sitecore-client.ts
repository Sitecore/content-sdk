import { SitecoreClient } from '@sitecore-content-sdk/angular';
import config from '../sitecore.config';

export const client = new SitecoreClient(config);
