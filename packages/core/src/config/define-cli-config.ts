import { SitecoreCliConfig, SitecoreCliConfigInpout } from './models';

const validateConfig = (cliConfig: SitecoreCliConfigInpout) => {
  if (!cliConfig.build?.commands?.length) {
    throw new Error('Configuration error: build commands should be defined in sitecore.cli.config');
  }

  if (!cliConfig.scaffold?.templates?.length) {
    throw new Error(
      'Configuration error: scaffold templates should be defined in sitecore.cli.config'
    );
  }
};

/**
 * Accepts a SitecoreCliConfigInpout object and returns sitecore cli configuration, updated with required default values
 * @param {SitecoreCliConfigInpout} cliConfig the cli configuration provided by the appication
 * @returns {SitecoreCliConfig} full sitecore cli configuration to use with cli
 */
export const defineCliConfig = (cliConfig: SitecoreCliConfigInpout): SitecoreCliConfig => {
  validateConfig(cliConfig);
  return cliConfig as SitecoreCliConfig;
};
