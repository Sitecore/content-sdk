import chalk from 'chalk';
import fs from 'fs-extra';
import * as glob from 'glob';
import path, { sep } from 'path';
import { Data, renderFile } from 'ejs';
import { writeFileToPath, isDevEnvironment } from '../utils/helpers';
import { BaseAppArgs } from '../base/args';

const FILE_FOR_COPY_REGEXP =
  /(index\.html)$|\.(gif|jpg|jpeg|tiff|png|svg|ashx|ico|pdf|jar|eot|woff|ttf|woff2)$/;

export type JsonPropertyType = number | string | boolean | (number | string)[] | JsonObjectType;
export type JsonObjectType = {
  [key: string]: JsonPropertyType;
};

/**
 * Retrieves Content SDK package versions from devDependencies.
 *
 * Reads the package.json from the create-content-sdk-app package root and
 * extracts all `@sitecore-content-sdk` dependencies with their versions.
 *
 * When the create-content-sdk-app package itself has a pre-release suffix
 * (e.g., `-canary`, `-beta`), any pre-release dependencies will have their
 * range prefixes (`^` or `~`) stripped to ensure exact version matching.
 * Stable dependencies retain their original version prefixes.
 *
 * @returns A dictionary of Content SDK package names to their versions
 */
export const getCsdkVersions = (): { [key: string]: string } => {
  const packageJson = fs.readJsonSync(path.resolve(__dirname, '../../../package.json'));
  const packageVersion = packageJson.version as string;
  const devDependencies = packageJson.devDependencies as { [key: string]: string };
  const csdkDependencies: { [key: string]: string } = {};

  const isPackagePreRelease = packageVersion.includes('-');

  for (const [name, version] of Object.entries(devDependencies)) {
    if (name.startsWith('@sitecore-content-sdk')) {
      const isDependencyPreRelease = version.includes('-');
      const shouldStripPrefix = isPackagePreRelease && isDependencyPreRelease;
      const resolvedVersion = shouldStripPrefix ? version.replace(/^[\^~]/, '') : version;
      csdkDependencies[name] = resolvedVersion;
    }
  }

  return csdkDependencies;
};

export const populateEjsData = (args: BaseAppArgs, destination?: string) => {
  const versions = getCsdkVersions();

  const ejsData: Data = {
    ...args,
    versions,
    helper: {
      isDev: isDevEnvironment(destination || args.destination),
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
 * @param {string} templatePath path to the template
 * @param {BaseArgs} args CLI arguments
 * @param {TransformOptions} options custom options
 */
export const transform = async (
  templatePath: string,
  args: BaseAppArgs,
  options: TransformOptions = {}
) => {
  const { isFileForCopy, isFileForSkip, fileForCopyRegExp = FILE_FOR_COPY_REGEXP } = options;

  const destinationPath = path.resolve(args.destination);

  const ejsData: Data = populateEjsData(args);
  // the templates to be run through ejs render or copied directly
  const files = glob.sync('**/*', {
    cwd: templatePath,
    dot: true,
    nodir: true,
  });

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
      fs.mkdirsSync(path.dirname(pathToNewFile));

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

      writeFileToPath(pathToNewFile, renderedFile);
    } catch (error) {
      console.log(chalk.red(error));
      console.log(`Error occurred when trying to render to ${chalk.yellow(path.resolve(file))}`);
    }
  }
};
