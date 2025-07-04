import { SitecoreCliConfig } from '@sitecore-content-sdk/core/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { tsImport } from 'tsx/esm/api';
import processEnv from './process-env.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Loads Sitecore Content SDK CLI configuration from the specified file.
 * @param {string} [configFile] - The path to the configuration file.
 * @returns {SitecoreCliConfig} The default export from the configuration file.
 * @throws Will throw an error if the configuration file does not exist or does not have a default export.
 */
export default async function loadCliConfig(configFile?: string): Promise<SitecoreCliConfig> {
  // If no config file is provided, try to load the default config file.
  if (!configFile) {
    configFile = './sitecore.cli.config.ts';
    if (!fs.existsSync(path.resolve(process.cwd(), configFile))) {
      configFile = './sitecore.cli.config.js';
    }
  } else {
    // configuration file/filepath has been provided
    // the env variables have been already loaded from the current working directory, however the current command may be running outside of a context of a project
    // if so try loading the env vars from the directory of the provided config file
    const configFileDirectory = path.dirname(path.resolve(process.cwd(), configFile));
    if (process.cwd() !== configFileDirectory) {
      processEnv(configFileDirectory);
    }
  }

  let cliConfig;

  try {
    cliConfig = await tsImport(
      pathToFileURL(path.resolve(process.cwd(), configFile)).href,
      __filename
    );
  } catch (e) {
    throw `Error while trying to load the cli configuration from ${configFile}. Error message: ${
      (e as Error).message
    }`;
  }

  return cliConfig.default;
}
