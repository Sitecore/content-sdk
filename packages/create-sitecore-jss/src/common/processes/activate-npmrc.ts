import { sep } from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

// for some reason npmrc is not copied with templates
// this is a workaround to address that - and ensure packages are installed from right place
/**
 * @param {string} templatePath
 * @param {string} destinationPath
 */
export function activateNpmrc(destinationPath: string) {
  console.log(chalk.cyan('Enabling npmrc'));
  if (fs.existsSync(`${destinationPath}${sep}npmrc-example`)) {
    fs.rename(`${destinationPath}${sep}npmrc-example`, `${destinationPath}${sep}.npmrc`);
  } else {
    console.log(chalk.cyan(`npmrc not found in ${destinationPath}`));
  }
}
