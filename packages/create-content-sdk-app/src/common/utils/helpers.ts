import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { JsonObjectType } from '../processes/transform';

/**
 * Determines whether a directory is inside this monorepo.
 * Walks up from `cwd` until it finds `lerna.json`.
 * @param {string} [cwd] path to the current working directory
 * @returns {boolean} is a development environment
 */
export const isDevEnvironment = (cwd?: string): boolean => {
  let current = path.resolve(cwd || process.cwd());
  const root = path.parse(current).root;

  while (true) {
    if (fs.existsSync(path.join(current, 'lerna.json'))) {
      return true;
    }

    if (current === root) {
      return false;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return false;
    }

    current = parent;
  }
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
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), {
      encoding: 'utf8',
    });
  } catch (error) {
    console.log(chalk.red(`The following error occurred while trying to write ${jsonFilePath}:`));
    console.log(chalk.red(error));
  }
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
