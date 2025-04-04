#!/usr/bin/env node

import resolve from 'resolve';
import processEnv from '../utils/process-env';
import * as commands from '../scripts';

/**
 * Resolves and executes the locally installed version of the sitecore content sdk CLI (sitecore-tools).
 */
resolve('@sitecore-content-sdk/cli', { basedir: process.cwd() }, (error, projectLocalCli) => {
  let cli;
  if (error) {
    // If there is an error, resolve could not find the cli
    // library from a package.json. Instead, include it from a relative
    // path to this script file (which is likely a globally installed
    // npm package).
    // Not erroring here because we might use this in future for scaffolding.
    cli = require('../cli').default;
    console.warn(
      'Sitecore Content SDK CLI is running in global mode because it was not installed in the local node_modules folder.'
    );
  } else {
    // No error implies a projectLocalCli, which will load whatever
    // version of jss-cli you have installed in a local package.json
    cli = require(projectLocalCli as string).default;

    // Since we are in context of a project, load its environment variables
    processEnv(process.cwd());
  }

  cli(commands);
});
