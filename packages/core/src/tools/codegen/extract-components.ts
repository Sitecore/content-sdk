import chalk from 'chalk';
import path from 'path';
import { fetchBearerToken } from '../auth/fetch-bearer-token';
import {
  resolveComponentImportFiles,
  sendCode,
  validateConsent,
  validateDeployContext,
} from './utils';
import { SitecoreConfig } from '../../config';

export type ExtactComponentsArgs = {
  scConfig: SitecoreConfig;
  compilerOptions: {
    [key: string]: unknown;
  };
  appFolder?: string;
  componentMapPath?: string;
};

/**
 * Extracts components from the app folder and sends them to XMCloud.
 * @param {ExtactComponentsArgs} args - Arguments for extracting components
 */
export async function extractComponents(args: ExtactComponentsArgs) {
  if (!validateConsent()) {
    console.log(chalk.yellow('Skipping code extraction, consent not given'));
    return;
  }
  if (!validateDeployContext()) {
    console.log(chalk.yellow('Skipping code extraction, not in deploy context'));
    return;
  }
  const basePath = args.appFolder ? resolveAppPath(args.appFolder) : process.cwd();
  try {
    const bearer = await fetchBearerToken(args.scConfig.api.m2m);
    if (!bearer) {
      console.error(chalk.red('Failed to get bearer token, aborting code extraction'));
      return;
    }

    const componentPaths = await resolveComponentImportFiles(
      basePath,
      args.compilerOptions,
      args.componentMapPath
    );

    const codeDispatches = Array.from(componentPaths, (mapEntry) =>
      sendCode({
        componentName: mapEntry[0],
        componentPath: mapEntry[1],
        token: bearer,
        edgeUrl: args.scConfig.api.edge.edgeUrl,
      })
    );

    await Promise.all(codeDispatches);
  } catch (error) {
    console.error(chalk.red('Error during component extraction:', error));
  }
}

const resolveAppPath = (appFolder: string) => {
  if (path.isAbsolute(appFolder)) return appFolder;
  return path.resolve(process.cwd(), appFolder);
};
