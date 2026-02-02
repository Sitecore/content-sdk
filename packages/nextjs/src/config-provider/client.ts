import 'client-only';
import { useSitecore } from '@sitecore-content-sdk/react';

const useSitecoreConfigProvider = () => {
  const { scConfig } = useSitecore();

  return {
    scConfig,
    initProvider: () => {
      console.log('No need to init config provider on client');
    },
  };
};

export default useSitecoreConfigProvider;
