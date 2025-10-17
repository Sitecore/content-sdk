import path from 'path';
import chalk from 'chalk';
import { run } from '../utils/cmd';
import { isDevEnvironment, openJsonFile } from '../utils/helpers';

/**
 * Executes packages installation, depending on the environment
 * @param {string} projectFolder path to the app folder
 * @param {boolean} [silent] suppress logs
 */
export const installPackages = (projectFolder: string, silent?: boolean) => {
  silent || console.log(chalk.cyan('Installing packages...'));

  // Check if this is a sample directory (contains 'sample-' in the path)
  const isSampleDirectory = projectFolder.includes('sample-');

  if (isDevEnvironment(projectFolder) && !isSampleDirectory) {
    silent || console.log(chalk.yellow('Detected development environment.'));

    run(
      'yarn',
      ['install'],
      {
        cwd: projectFolder,
        encoding: 'utf8',
        env: { ...process.env, NODE_NO_WARNINGS: '1' },
      },
      silent
    );
  } else {
    // Use npm for samples and production environments
    if (isSampleDirectory) {
      silent || console.log(chalk.yellow('Using npm for sample directory.'));
    }

    run(
      'npm',
      ['install', '--loglevel=error'],
      {
        cwd: projectFolder,
        encoding: 'utf8',
      },
      silent
    );
  }
};

/**
 * Fixes possible linting issues
 * @param {string} projectFolder path to the app folder
 * @param {boolean} [silent] suppress logs
 */
export const lintFix = (projectFolder: string, silent?: boolean) => {
  const pkg = getPackageJson(projectFolder);
  if (!pkg?.scripts?.lint) {
    return;
  }

  silent || console.log(chalk.cyan('Linting app...'));
  run(
    'npm',
    ['run', 'lint', '--', '--fix'],
    {
      cwd: projectFolder,
      encoding: 'utf8',
    },
    silent
  );
};

const getPackageJson = (projectFolder: string) => {
  const packagePath = path.join(projectFolder, 'package.json');
  return openJsonFile(packagePath);
};
