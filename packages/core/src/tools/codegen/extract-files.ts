/* eslint-disable jsdoc/require-jsdoc */
import chalk from 'chalk';
import {
  ExtractedFileType,
  resolveComponentImportFiles,
  sendCode,
  validateDeployContext,
  readNamedExports,
} from './utils';
import { SitecoreConfig } from './../../config';
import { auth } from '../../tools';
import debug from './../../debug';
import path from 'path';
import fs from 'fs';

export type ExtractFilesConfig = {
  /**
   * @deprecated Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
   */
  scConfig?: SitecoreConfig;
  componentMapPath?: string;
  clientComponentMapPath?: string;
  customValidateDeployContext?: () => boolean;
};

/**
 * Extracts components from the app folder and sends them to XMCloud.
 * @param {ExtractFilesConfig} args - Config for components extraction
 * @public
 */
export let extractFiles = _extractFiles;

// mock setup for unit tests to make sinon happy and mock-able with esbuild/tsx
// https://sinonjs.org/how-to/typescript-swc/
// This, plus the `_` names make the exports writable for sinon
export const unitMocks = {
  set extractFiles(mockImplementation) {
    extractFiles = mockImplementation;
  },
  get extractFiles() {
    return _extractFiles;
  },
};

function _extractFiles(args: ExtractFilesConfig = {}) {
  const authParams = {
    clientId: process.env.SITECORE_AUTH_CLIENT_ID || '',
    clientSecret: process.env.SITECORE_AUTH_CLIENT_SECRET || '',
    authority: process.env.SITECORE_AUTH_AUTHORITY,
    audience: process.env.SITECORE_AUTH_AUDIENCE,
  };
  return async ({ scConfig }: { scConfig?: SitecoreConfig } = {}) => {
    const config = args.scConfig ?? scConfig;

    if (!config) {
      throw new Error('Sitecore configuration is required to be provided');
    }

    if (
      (args.customValidateDeployContext && !args.customValidateDeployContext()) ||
      !validateDeployContext()
    ) {
      debug.common('Skipping code extraction, not in deploy context');
      return;
    }
    if (config.disableCodeGeneration) {
      debug.common('Skipping code extraction, code generation has been disabled');
      return;
    }

    console.log(chalk.green('Code extraction started'));

    const basePath = process.cwd();

    try {
      // Use Edge Platform mesh endpoint - staging is ready, prod QA in progress
      const targetUrl = config.api.edge.edgeUrl;
      const { accessToken } = await auth.clientCredentialsFlow(authParams);
      if (!accessToken) {
        console.error(chalk.red('Failed to get access token, aborting code extraction'));
        return;
      }

      // Resolve files from component-map
      const resolvedImports = await resolveComponentImportFiles(basePath, args.componentMapPath);

      const clientComponentMapPath =
        args.clientComponentMapPath || '.sitecore/component-map.client.ts';
      const absClientMapPath = path.isAbsolute(clientComponentMapPath)
        ? clientComponentMapPath
        : path.resolve(basePath, clientComponentMapPath);
      const exists = fs.existsSync(absClientMapPath);
      if (exists) {
        resolvedImports.push(...(await resolveComponentImportFiles(basePath, absClientMapPath)));
      }

      const fileDispatches: Promise<string | null>[] = [];

      for (const { componentKey, filePath, fileType } of resolvedImports) {
        let extraLabels: Record<string, unknown> | undefined;

        // return an array of export names (e.g., ['Default','Cooler'])
        const variantNames = readNamedExports(filePath);

        extraLabels = {
          ...(variantNames.length ? { variantNames } : {}),
        };

        fileDispatches.push(
          sendCode({
            file: {
              name: componentKey,
              path: filePath,
              type: fileType,
              labels: extraLabels,
            },
            token: accessToken,
            targetUrl,
          })
        );
      }

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
      console.warn(chalk.yellow('Error during code extraction:', error, error.stack));
    }
  };
}
