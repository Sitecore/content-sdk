/* eslint-disable jsdoc/require-jsdoc */
import chalk from 'chalk';
import {
  ExtractedFileType,
  resolveComponentImportFiles,
  sendCode,
  validateDeployContext,
  readNamedExports,
  ResolvedImport,
} from './utils';
import { SitecoreConfig } from './../../config';
import { auth } from '../../tools';
import debug from './../../debug';
import fs from 'fs';
import path from 'path';

export type ExtractFilesConfig = {
  scConfig: SitecoreConfig;
  componentMapPath?: string;
  customValidateDeployContext?: () => boolean;
  enableVariantsInMap?: boolean;
};

type ResolveResult = { imports: ResolvedImport[] };

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
    authority: 'https://auth-staging-1.sitecore-staging.cloud',
    audience: 'https://api-staging.sitecore-staging.cloud',
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

      console.log(resolvedImports);

      let items: Array<{ componentKey: string; filePath: string }> = [];

      if (resolvedImports && typeof (resolvedImports as ResolveResult).imports !== 'undefined') {
        // With variants
        items = (resolvedImports as ResolveResult).imports.map(({ componentKey, filePath }) => ({
          componentKey,
          filePath,
        }));
      } else if (
        resolvedImports &&
        typeof (resolvedImports as unknown as Map<string, string>).forEach === 'function'
      ) {
        // Without Variants
        (resolvedImports as unknown as Map<string, string>).forEach((absPath, key) => {
          items.push({ componentKey: key, filePath: absPath });
        });
      } else {
        console.error(chalk.red('resolveComponentImportFiles: unexpected return shape'));
        return;
      }

      const fileDispatches: Promise<string | null>[] = [];

      for (const { componentKey, filePath } of items) {
        if (!fs.existsSync(filePath)) {
          console.warn(chalk.yellow(`Skipping missing file: ${filePath}`));
          continue;
        }

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
