/**
 * Scaffolds sample apps from `samples.json` into `samples/`.
 * Usage: yarn scaffold-samples [product] — all products' samples by default.
 */
const chalk = require('chalk');

const { initialize } = require('../packages/create-content-sdk-app/dist/initialize');
const { getAppFolder, getSamples } = require('./utils');

const product = process.argv[2];
const samplesToScaffold = getSamples(product);
if (samplesToScaffold.length === 0) {
  console.log(chalk.yellow(`No samples defined for ${product}; nothing to scaffold.`));
}

for (const sample of samplesToScaffold) {
  const appFolder = getAppFolder({ ...sample.args, template: sample.template });
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
