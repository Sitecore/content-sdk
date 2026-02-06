import { SitecoreClient } from '@sitecore-content-sdk/atro';
import config from '../sitecore.config';

export const client = new SitecoreClient(config);
