import path from 'path';
import chalk from 'chalk';
import chokidar from 'chokidar';
import fs from 'fs-extra';

const templatesFolder = path.resolve(__dirname, '../src/templates');
const distFolder = path.resolve(__dirname, '../dist/templates');

/**
 * Copies the templates folder to dist so scaffolding picks up local edits.
 */
const sync = async () => {
  try {
    await fs.copy(templatesFolder, distFolder);
    console.log(chalk.green('Templates synced to dist.'));
  } catch (error) {
    console.log(chalk.red('An error occurred while copying templates: ', error));
  }
};

chokidar
  .watch(templatesFolder, { ignoreInitial: true })
  .on('ready', () => {
    console.log(chalk.green('Watching templates for changes...'));
    void sync();
  })
  .on('all', (event, changedPath) => {
    console.log(chalk.white(`${event} ${changedPath}`));
    void sync();
  });
