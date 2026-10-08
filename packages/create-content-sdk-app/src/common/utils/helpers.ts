import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

/**
 * Determines whether you are in a dev environment.
 * It's `true` if you are inside the monorepo
 * @param {string} [cwd] path to the current working directory
 * @returns {boolean} is a development environment
 */
export const isDevEnvironment = (cwd?: string): boolean => {
  const currentPath = path.resolve(cwd || process.cwd());
  const lernaPath = path.join(currentPath, '..', '..');

  return fs.existsSync(path.join(lernaPath, 'lerna.json'));
};

/**
 * Provides json data from a file
 * @param {string} jsonFilePath path to the .json file.
 * @returns json data
 */
export const openJsonFile = (jsonFilePath: string) => {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return data ? JSON.parse(data) : undefined;
  } catch (error) {
    console.log(chalk.red(`The following error occurred while trying to read ${jsonFilePath}:`));
    console.log(chalk.red(error));
  }
};

export const writeFileToPath = (destinationPath: string, content: string) => {
  fs.writeFileSync(destinationPath, content, 'utf8');
};
