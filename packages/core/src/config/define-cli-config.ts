import { SitecoreCliConfig, SitecoreCliConfigInput } from './models';

const validateConfig = (cliConfig: SitecoreCliConfigInput) => {
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
 * Accepts a SitecoreCliConfigInput object and returns sitecore cli configuration, updated with required default values
 * @param {SitecoreCliConfigInput} cliConfig the cli configuration provided by the application
 * @returns {SitecoreCliConfig} full sitecore cli configuration to use with cli
 */
export const defineCliConfig = (cliConfig: SitecoreCliConfigInput): SitecoreCliConfig => {
  validateConfig(cliConfig);
  return cliConfig as SitecoreCliConfig;
};
