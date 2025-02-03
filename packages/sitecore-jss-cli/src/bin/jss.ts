#!/usr/bin/env node

import resolve from 'resolve';
import processEnv from '../utils/process-env';

resolve('@sitecore-jss/sitecore-jss-cli', { basedir: process.cwd() }, (_, projectLocalCli) => {
  // No error implies a projectLocalCli, which will load whatever
  // version of jss-cli you have installed in a local package.json
  const cli = require(projectLocalCli as string).default;

  // Since we are in context of a project, load its environment variables
  processEnv(process.cwd());

  cli();
});
