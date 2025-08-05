import chalk from 'chalk';
import {
  ExtractedFileType,
  resolveComponentImportFiles,
  sendCode,
  validateDeployContext,
} from './utils';
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { auth } from '@sitecore-content-sdk/core/tools';
import { debug } from '@sitecore-content-sdk/core';
import path from 'path';

export type ExtractFilesConfig = {
  scConfig: SitecoreConfig;
  componentMapPath?: string;
  customValidateDeployContext?: () => boolean;
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
  return async() => {
    if (
      (args.customValidateDeployContext && !args.customValidateDeployContext()) ||
      !validateDeployContext()
    ) {
      debug.common('Skipping code extraction, not in deploy context');
      return;
    }
    if (args.scConfig.disableCodeGeneration) {
      debug.common('Skipping code extraction, code generation has been disabled');
      return;
    }
    console.log(chalk.green('Code extraction started'));
    const basePath = process.cwd();

    try {
      // Use Edge Platform mesh endpoint - staging is ready, prod QA in progress
      const targetUrl = args.scConfig.api.edge.edgeUrl;
      const { accessToken } = await auth.clientCredentialsFlow(authParams);
      if (!accessToken) {
        console.error(chalk.red('Failed to get access token, aborting code extraction'));
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

      const files = await Promise.all(fileDispatches);
      console.log(
        chalk.green(
          `Code extraction completed successfully, files extracted:\r\n${files
            .filter((file) => file !== null)
            .join('\r\n')}`
        )
      );
    } catch (error) {
      console.error(chalk.red('Error during code extraction:', error));
    }
  };
};
