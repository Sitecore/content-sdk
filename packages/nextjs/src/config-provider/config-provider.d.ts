import { SitecoreConfig } from '@sitecore-content-sdk/content/config';

// Utility constant to identify if code is bundeled for RSC environment or client environment
declare const useSitecoreConfigProvider: () => {
  scConfig: SitecoreConfig;
  initProvider: (v: SitecoreConfig) => void;
};
export default useSitecoreConfigProvider;
