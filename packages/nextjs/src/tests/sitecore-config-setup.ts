import sitecoreConfig from '../test-data/config/sitecore.config';
import { initSitecore } from '@sitecore-content-sdk/core/config';

initSitecore({
  sitecoreConfig,
  sites: [],
});
