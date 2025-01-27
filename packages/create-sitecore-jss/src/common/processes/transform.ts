import chalk from 'chalk';
import fs from 'fs-extra';
import glob from 'glob';
import path, { sep } from 'path';
import { Data, renderFile } from 'ejs';
import inquirer from 'inquirer';
import {
  getPascalCaseName,
  getAppPrefix,
  writeFileToPath,
  isDevEnvironment,
} from '../utils/helpers';
import { diffLines, diffJson, Change } from 'diff';
import { BaseArgs } from '../base/args';
const { version } = require('../../../package.json');

const FILE_FOR_COPY_REGEXP = /(index\.html)$|\.(gif|jpg|jpeg|tiff|png|svg|ashx|ico|pdf|jar|eot|woff|ttf|woff2)$/;

export type JsonPropertyType = number | string | boolean | (number | string)[] | JsonObjectType;
export type JsonObjectType = {
  [key: string]: JsonPropertyType;
};

export const transformFilename = (file: string, args: BaseArgs): string => {
  // eslint-disable-next-line guard-for-in
  for (const key in args) {
    const value = args[key];
    if (typeof value !== 'string') continue;

    file = file.replace(`{{${key}}}`, value);
  }
  return file;
};

/**
 * @param {string} sourceFileContent transformed version of our template
 * @param {string} targetFilePath user's file path
 */
export const diffFiles = async (
  sourceFileContent: string,
  targetFilePath: string
): Promise<string> => {
  if (!fs.pathExistsSync(targetFilePath)) return '';

  const targetFileContents = fs.readFileSync(path.resolve(process.cwd(), targetFilePath), 'utf8');

  if (targetFileContents === sourceFileContent) return '';

  const diff = targetFilePath.endsWith('.json')
    ? diffJson(JSON.parse(targetFileContents), JSON.parse(sourceFileContent))
    : diffLines(targetFileContents, sourceFileContent);

  diff.forEach((change: Change) => {
    const color = change.added ? chalk.green : change.removed ? chalk.red : chalk.gray;
    const prefix = change.added ? '+' : change.removed ? '-' : '=';

    change.value.split('\n').forEach((value) => {
      if (!value) return;

      console.log(color(`${prefix} ${value}`));
    });
  });
  // TODO - enhancement: Write 'pagination' function that prints off
  // only x lines and prints remaining x lines on user input.
  // allow user to move forward and back like when piping to more in bash
  // examples of more: https://shapeshed.com/unix-more/#what-is-the-more-command-in-unix

  console.log(`Showing potential changes in ${chalk.yellow(targetFilePath.replace('/', '\\'))}`);

  const answer = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    choices: ['yes', 'skip', 'yes to all', 'abort'],
    message: `File ${chalk.yellow(
      targetFilePath.replace('/', '\\')
    )} is about to be overwritten with the above changes. Are you sure you want to continue?`,
  });

  return answer.choice;
};

export const diffAndWriteFiles = async ({
  rendered,
  pathToNewFile,
  args,
}: {
  rendered: string;
  pathToNewFile: string;
  args: BaseArgs;
}) => {
  const targetFilePath = transformFilename(pathToNewFile, args);
  const choice = await diffFiles(rendered, targetFilePath);

  switch (choice) {
    case 'yes':
      writeFileToPath(targetFilePath, rendered);
      return;
    case 'yes to all':
      // set force to true so diff is not run again
      args.force = true;
      writeFileToPath(targetFilePath, rendered);
      return;
    case 'skip':
      return;
    case 'abort':
      console.log(chalk.yellow('Goodbye!'));
      return process.exit();
    // eslint-disable no-fallthrough
    case '':
      // writeFile to default case so that when an initializer is
      // run for the first time, it will still copy files that
      // do not return a diff.
      writeFileToPath(targetFilePath, rendered);
      return;
    default:
      return;
  }
};

export const populateEjsData = (args: BaseArgs, destination?: string) => {
  // pass in helper to args object

  // Don't expose canary build number in the generated app
  const jssVersion = version.includes('canary')
    ? version.replace(/(-canary\.\d+)$/, '-canary')
    : version;

  const ejsData: Data = {
    ...args,
    version: jssVersion,
    helper: {
      isDev: isDevEnvironment(destination || args.destination),
      getPascalCaseName: getPascalCaseName,
      getAppPrefix: getAppPrefix,
    },
  };
  return ejsData;
};

type TransformOptions = {
  /**
   * Determines whether a file should be copied only (not rendered through ejs)
   * Can be used if you need additional logic instead of just using `fileForCopyRegExp`
   * @param {string} file path to a file
   * @param {RegExp} fileForCopyRegExp default RegExp used for determination
   */
  isFileForCopy?: (file: string, fileForCopyRegExp: RegExp) => boolean;
  /**
   * Determines whether a file should be skiped (not copied/rendered).
   * @param {string} file path to a file
   */
  isFileForSkip?: (file: string) => boolean;
  /**
   * Custom RegExp to determine which files should be copied only (not rendered through ejs)
   * @default FILE_FOR_COPY_REGEXP
   */
  fileForCopyRegExp?: RegExp;
};

/**
 * Handles each template file and applies ejs renderer, also:
 * - Determines files for copy.
 * - Determines files for skip.
 * if some files already exist:
 *   - compares diffs
 * @param {string} templatePath path to the template
 * @param {BaseArgs} args CLI arguments
 * @param {TransformOptions} options custom options
 */
export const transform = async (
  templatePath: string,
  args: BaseArgs,
  options: TransformOptions = {}
) => {
  const { isFileForCopy, isFileForSkip, fileForCopyRegExp = FILE_FOR_COPY_REGEXP } = options;

  const destinationPath = path.resolve(args.destination);

  if (!args.appPrefix) {
    args.appPrefix = false;
  }

  const ejsData: Data = populateEjsData(args);
  // the templates to be run through ejs render or copied directly
  const files = glob.sync('**/*', { cwd: templatePath, dot: true, nodir: true });

  for (const file of files) {
    try {
      let pathToNewFile = `${destinationPath}${sep}${file}`;
      const pathToTemplate = path.join(templatePath, file);

      // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
      // See: https://github.com/npm/npm/issues/1862
      if (!file.endsWith('.gitignore') && file.endsWith('gitignore')) {
        pathToNewFile = pathToNewFile.replace(/\gitignore$/, '.gitignore');
      }

      if (isFileForSkip && isFileForSkip(file)) {
        continue;
      }

      // if the directory doesn't exist, create it
      fs.mkdirsSync(path.dirname(transformFilename(pathToNewFile, args)));

      if (isFileForCopy ? isFileForCopy(file, fileForCopyRegExp) : file.match(fileForCopyRegExp)) {
        // pdfs may have <% encoded, which throws an error for ejs.
        // we simply want to copy file if it's a pdf, not render it with ejs.
        fs.copySync(pathToTemplate, pathToNewFile);
        continue;
      }

      // holds the content to be written to the new file
      const renderedFile: string | undefined = await renderFile(
        path.resolve(pathToTemplate),
        ejsData
      );

      if (!args.force) {
        await diffAndWriteFiles({
          rendered: renderedFile,
          pathToNewFile,
          args,
        });
      } else {
        writeFileToPath(transformFilename(pathToNewFile, args), renderedFile);
      }
    } catch (error) {
      console.log(chalk.red(error));
      console.log(`Error occurred when trying to render to ${chalk.yellow(path.resolve(file))}`);
    }
  }
};
