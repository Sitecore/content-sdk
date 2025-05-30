import chalk from 'chalk';
import {
  ExtractedFileType,
  resolveComponentImportFiles,
  sendCode,
  validateConsent,
  validateDeployContext,
} from './utils';
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { auth } from '@sitecore-content-sdk/core/tools';
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
    authority: process.env.SITECORE_AUTH_AUTHORITY,
    audience: process.env.SITECORE_AUTH_AUDIENCE,
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
    const basePath = process.cwd();

    try {
      // MESH_URL is temporary option to use until mesh is onboarded into Edge Proxy
      const targetUrl = process.env.SITECORE_MESH_URL || args.scConfig.api.edge.edgeUrl;
      const { accessToken } = await auth.clientCredentialsFlow(authParams);
      if (!accessToken) {
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
          token: accessToken,
          targetUrl,
        })
      );

      fileDispatches.push(
        sendCode({
          file: {
            name: 'package.json',
            path: path.resolve(basePath, './package.json'),
            type: ExtractedFileType.PackageJson,
          },
          token: accessToken,
          targetUrl,
        })
      );

      await Promise.all(fileDispatches);
    } catch (error) {
      console.error(chalk.red('Error during component extraction:', error));
    }
  };
};
