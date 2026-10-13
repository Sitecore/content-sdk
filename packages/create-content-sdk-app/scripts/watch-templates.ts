import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import chokidar from 'chokidar';

import { main } from '../src/bin';

// Template packages live under ../../templates. For live dev we watch each package's
// SOURCE templates and copy them into that package's dist/templates (what the CLI
// consumes) before re-scaffolding. This keeps `yarn watch` a single self-contained
// command: source edits are synced to dist in-process, so no separate per-package
// build/watch needs to run alongside it.
const packagesDir = path.resolve(process.cwd(), '../../templates');

type TemplatePackage = { src: string; dist: string };

const templatePackages: TemplatePackage[] = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((product) => ({
    src: path.join(packagesDir, product.name, 'src', 'templates'),
    dist: path.join(packagesDir, product.name, 'dist', 'templates'),
  }))
  .filter((pkg) => fs.existsSync(pkg.src));

const srcDirs = templatePackages.map((pkg) => pkg.src);

console.log('Watching templates from:', srcDirs);

chokidar
  .watch(srcDirs, { ignoreInitial: true })
  .on('ready', () => ready())
  .on('all', (event, changedPath) => callback(event, changedPath));

/**
 * Syncs a template package's source templates into its dist so the CLI renders the
 * latest edits.
 * @param {TemplatePackage} pkg template package to sync
 */
const syncToDist = async (pkg: TemplatePackage) => {
  await fs.copy(pkg.src, pkg.dist);
};

/**
 * Initializes the apps.
 */
async function ready() {
  console.log(chalk.green('Initializing app...'));
  await Promise.all(templatePackages.map(syncToDist));
  await initializeApps(false);
  console.log(chalk.green('Initializing app complete. Watching for changes...'));
}

/**
 * Callback for chokidar.
 * @param {string} event - The event that occurred.
 * @param {string} changedPath - The path of the file that was changed.
 */
async function callback(event?: string, changedPath?: string) {
  const color = event === 'add' ? chalk.green : event === 'unlink' ? chalk.red : chalk.white;
  console.table(color(`${event} ${changedPath}`));
  const changed = templatePackages.find((pkg) => changedPath?.startsWith(pkg.src));
  if (changed) {
    await syncToDist(changed);
  }
  await initializeApps(true);
}

/**
 * restore dependencies added to yarn.lock file post initializing a sample app using the watch script.
 * this is necessary so that these dependencies dont get committed to the source control.
 */
function restoreLockfile() {
  const output = execSync('git status', { encoding: 'utf-8' });
  if (output.includes('yarn.lock')) {
    execSync('git restore ../../yarn.lock', { encoding: 'utf-8' });
  }
}

const initializeApps = async (noInstall: boolean) => {
  let watch;
  try {
    watch = await import(path.resolve('watch.json'));
    await main({ ...watch.args, template: watch.template, noInstall });
    restoreLockfile();
  } catch (error) {
    console.log(chalk.red('An error occurred: ', error));
    if (!watch) {
      console.log(
        chalk.red('Could not find config. Did you create a watch.json file at the root?')
      );
    }

    process.exit(1);
  }
};
