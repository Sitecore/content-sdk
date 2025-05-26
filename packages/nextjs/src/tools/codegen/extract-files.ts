import chalk from 'chalk';
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
import path from 'path';

export type ExtractFilesConfig = {
  scConfig: SitecoreConfig;
  componentMapPath?: string;
};

/**
 * Extracts components from the app folder and sends them to XMCloud.
 * @param {ExtractFilesConfig} args - Config for components extraction
 */
export const extractFiles = (args: ExtractFilesConfig) => {
  const authParams = {
    clientId: process.env.SITECORE_AUTH_CLIENT_ID || '',
    clientSecret: process.env.SITECORE_AUTH_CLIENT_SECRET || '',
    endpoint: process.env.SITECORE_AUTH_ENDPOINT || constants.DEFAULT_SITECORE_AUTH_ENDPOINT,
    audience: process.env.SITECORE_AUTH_AUDIENCE || constants.DEFAULT_SITECORE_AUTH_AUDIENCE,
  };
  return async () => {
    if (!process.env.SITECORE_MESH_URL) {
      console.log(
        chalk.yellow('Skipping code extraction, SITECORE_MESH_URL environment variable is not set')
      );
      return;
    }
    if (!validateDeployContext()) {
      console.log(chalk.yellow('Skipping code extraction, not in deploy context'));
      return;
    }
    if (!validateConsent()) {
      console.log(chalk.yellow('Skipping code extraction, consent not given'));
      return;
    }
    const basePath = process.cwd();

    try {
      const endpoint = process.env.SITECORE_MESH_URL;
      const bearer = await fetchBearerToken(authParams);
      if (!bearer) {
        console.error(chalk.red('Failed to get bearer token, aborting code extraction'));
        return;
      }

      const componentPaths = await resolveComponentImportFiles(basePath, args.componentMapPath);

      const fileDispatches = Array.from(componentPaths, (mapEntry) =>
        sendCode({
          file: {
            name: mapEntry[0],
            path: mapEntry[1],
            type: ExtractedFileType.Component,
          },
          token: bearer,
          endpoint,
        })
      );

      fileDispatches.push(
        sendCode({
          file: {
            name: 'package.json',
            path: path.resolve(basePath, './package.json'),
            type: ExtractedFileType.PackageJson,
          },
          token: bearer,
          endpoint,
        })
      );

      await Promise.all(fileDispatches);
    } catch (error) {
      console.error(chalk.red('Error during component extraction:', error));
    }
  };
};
