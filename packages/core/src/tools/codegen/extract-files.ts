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

export type ExtractFilesConfig = {
  scConfig: SitecoreConfig;
  componentMapPath?: string;
  customValidateDeployContext?: () => boolean;
  enableVariantsInMap?: boolean;
};

/**
 * Extracts components from the app folder and sends them to XMCloud.
 * @param {ExtractFilesConfig} args - Config for components extraction
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

function _extractFiles(args: ExtractFilesConfig) {
  const authParams = {
    clientId: process.env.SITECORE_AUTH_CLIENT_ID || '',
    clientSecret: process.env.SITECORE_AUTH_CLIENT_SECRET || '',
    authority: process.env.SITECORE_AUTH_AUTHORITY || '',
    audience: process.env.SITECORE_AUTH_AUDIENCE || '',
  };

  const enableVariantsInMap = args.enableVariantsInMap ?? true;

  return async () => {
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
      const targetUrl = args.scConfig.api.edge.edgeUrl;
      const { accessToken } = await auth.clientCredentialsFlow(authParams);
      if (!accessToken) {
        console.error(chalk.red('Failed to get access token, aborting code extraction'));
        return;
      }

      // Resolve files from component-map
      const resolvedImports = await resolveComponentImportFiles(basePath, args.componentMapPath);

      const fileDispatches: Promise<string | null>[] = [];

      for (const { componentKey, filePath } of resolvedImports.imports) {
        let extraLabels: Record<string, unknown> | undefined;

        if (enableVariantsInMap) {
          // return an array of export names (e.g., ['Default','Cooler'])
          const variantNames = readNamedExports(filePath);

          extraLabels = {
            ...(variantNames.length ? { variantNames } : {}),
          };
        }

        fileDispatches.push(
          sendCode({
            file: {
              name: componentKey,
              path: filePath,
              type: ExtractedFileType.Component,
            },
            token: accessToken,
            targetUrl,
            extraLabels,
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
      console.error(chalk.red('Error during code extraction:', error));
    }
  };
}
