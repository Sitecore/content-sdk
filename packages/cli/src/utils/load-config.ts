import path from 'path';
const tsx = require('tsx/cjs/api');

/**
 * Loads the sitecore CLI configuration from the specified file.
 * @param {string} configFile - The path to the configuration file.
 * @returns {any} The default export from the configuration file.
 * @throws Will throw an error if the configuration file does not exist or does not have a default export.
 */
export default function loadCliConfig(configFile: string): any {
  configFile = configFile || './sitecore.cli.config.ts';
  let cliConfig;

  try {
    cliConfig = tsx.require(path.resolve(process.cwd(), configFile), __filename);
  } catch (e) {
    throw `cli configuration not found in ${configFile}. Please ensure the file exists at the specified location.`;
  }

  return cliConfig.default;
}
