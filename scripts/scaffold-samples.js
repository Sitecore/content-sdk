const chalk = require('chalk');

const { initialize } = require('../packages/create-app/dist/initialize');
const samplesToScaffold = require('./samples.json');
const { getAppFolder } = require('./utils');

for (const sample of samplesToScaffold) {
  const appFolder = getAppFolder(sample.args);
  sample.args.destination = `./samples/${appFolder}`;
  console.log(chalk.green(`Initializing sample ${appFolder} ...`));
  let scaffoldArgs = {
    template: sample.template,
    yes: true,
    force: true,
    silent: true,
    ...sample.args,
  };
  initialize(sample.template, scaffoldArgs);
}
