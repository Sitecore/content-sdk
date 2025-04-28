import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import {
  ExtractedFileType,
  resolveComponentImportFiles,
  sendCode,
  validateConsent,
  validateDeployContext,
} from './utils';
import { constants } from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { fetchBearerToken } from '@sitecore-content-sdk/core/tools';

export type ExtractComponentsConfig = {
  scConfig: SitecoreConfig;
  appFolder?: string;
  componentMapPath?: string;
};

/**
 * Extracts components from the app folder and sends them to XMCloud.
 * @param {ExtractComponentsConfig} args - Config for components extraction
 */
export const extractComponents = (args: ExtractComponentsConfig) => {
  // TODO: use values from CLI config, when CLI logic allows commands to read it
  const authParams = {
    clientId: process.env.SITECORE_AUTH_CLIENT_ID || '',
    clientSecret: process.env.SITECORE_AUTH_CLIENT_SECRET || '',
    endpoint: constants.DEFAULT_SITECORE_AUTH_ENDPOINT,
    audience: constants.DEFAULT_SITECORE_AUTH_AUDIENCE,
  };
  return async () => {
    if (!validateDeployContext()) {
      console.log(chalk.yellow('Skipping code extraction, not in deploy context'));
      return;
    }
    if (!validateConsent()) {
      console.log(chalk.yellow('Skipping code extraction, consent not given'));
      return;
    }
    const basePath = args.appFolder ? resolveAppPath(args.appFolder) : process.cwd();
    if (!fs.existsSync(path.join(basePath, 'package.json'))) {
      console.error(chalk.red('No app folder found at ', basePath));
      return;
    }
    try {
      const bearer = await fetchBearerToken(authParams);
      if (!bearer) {
        console.error(chalk.red('Failed to get bearer token, aborting code extraction'));
        return;
      }

      const componentPaths = await resolveComponentImportFiles(basePath, args.componentMapPath);

      const codeDispatches = Array.from(componentPaths, (mapEntry) =>
        sendCode({
          file: {
            name: mapEntry[0],
            path: mapEntry[1],
            type: ExtractedFileType.Component,
          },
          token: bearer,
          edgeUrl: args.scConfig.api.edge.edgeUrl,
        })
      );

      await Promise.all(codeDispatches);
    } catch (error) {
      console.error(chalk.red('Error during component extraction:', error));
    }
  };
};

const resolveAppPath = (appFolder: string) => {
  if (path.isAbsolute(appFolder)) return appFolder;
  return path.resolve(process.cwd(), appFolder);
};
