import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { JsonObjectType } from '../processes/transform';

/**
 * Determines whether you are in a dev environment.
 * It's `true` if you are inside the monorepo
 * @param {string} [cwd] path to the current working directory
 * @returns {boolean} is a development environment
 */
export const isDevEnvironment = (cwd?: string): boolean => {
  const currentPath = path.resolve(cwd || process.cwd());
  // TODO: is there a better way to detect this?
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

/**
 * Creates a .json file and inserts provided data
 * @param {object} data data to be written into the .json file
 * @param {string} jsonFilePath a path to a file.
 */
export const writeJsonFile = (data: { [key: string]: unknown }, jsonFilePath: string) => {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
  } catch (error) {
    console.log(chalk.red(`The following error occurred while trying to write ${jsonFilePath}:`));
    console.log(chalk.red(error));
  }
};

/**
 * Save configuration params to the package.json
 * @param {string[]} template template applied to the sample
 * @param {string} [pkgPath] path to the package.json
 */
export const saveConfiguration = (template: string, pkgPath: string) => {
  const pkg = openJsonFile(pkgPath);

  writeJsonFile({ ...pkg, config: { ...pkg.config, template } }, pkgPath);
};

export const sortKeys = (obj: JsonObjectType) => {
  const sorted: any = {};
  Object.keys(obj)
    .sort()
    .forEach((key: string) => (sorted[key] = obj[key]));

  return sorted;
};

/**
 * Returns all templates
 * @returns {string[]} templates
 */
export const getAllTemplates = (): string[] => {
  const templatePath = path.resolve(__dirname, './../../templates');
  return fs.readdirSync(templatePath, 'utf8');
};

export const writeFileToPath = (destinationPath: string, content: string) => {
  fs.writeFileSync(destinationPath, content, 'utf8');
};

export const removeFile = (filePath: string) => {
  fs.unlinkSync(filePath);
};
