const chalk = require('chalk');

const { initialize } = require('../packages/create-sitecore-jss/dist/initialize');
const samplesToScaffold = require('./samples.json');
const { getAppName } = require('./utils');

for (const sample of samplesToScaffold) {
  const appName = getAppName(sample.args);
  sample.args.destination = `./samples/${appName}`;
  sample.args.hostName = `${appName}.jss.localhost`;
  console.log(chalk.green(`Initializing sample ${appName} ...`));
  // we need to keep noInstall as true - otherwise both yarn install and lint will execute
  // we run lint separately in the azure pipeline
  let scaffoldArgs = {
    template: sample.template,
    yes: true,
    force: true,
    silent: true,
    noInstall: true,
    ...sample.args,
  };
  initialize(sample.template, scaffoldArgs);
}
