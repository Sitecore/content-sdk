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
    // Not erroring here because cli can be used in global mode.
    cli = require('../cli').default;
    console.warn(
      'Sitecore Content SDK CLI is running in global mode because it was not installed in the local node_modules folder.'
    );
  } else {
    // No error implies a projectLocalCli, which will load whatever
    // version of content sdk cli you have installed in a local package.json
    cli = require(projectLocalCli as string).default;
  }

  // load environment variables from current working directory
  // if the current working directory is not an app project root .env file will be missing and nothing will be loaded
  // in that case loading environment variables will be handled by the actual cli command
  processEnv(process.cwd());

  // Re-enable debug logging after environment variables are loaded
  // This ensures that DEBUG environment variables from .env files take effect
  if (process.env.DEBUG) {
    console.log(`Debug enabled: ${process.env.DEBUG}`);
    const debug = require('debug');
    debug.enable(process.env.DEBUG);
  }

  cli(commands);
});
