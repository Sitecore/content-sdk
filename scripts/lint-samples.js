/**
 * Lints (with --fix) the scaffolded sample apps from `samples.json`.
 * Usage: yarn lint-samples [product] — all products' samples by default.
 */
const { execSync } = require('child_process');
const { getAppFolder, getSamples, sampleNamePrefix } = require('./utils');

const runLintCommand = (scope) =>
  execSync(`lerna run lint --scope ${scope} -- --fix`, {
    stdio: 'inherit',
  });

const apps = getSamples(process.argv[2]).map((sample) =>
  getAppFolder({ ...sample.args, template: sample.template })
);

if (apps.length > 0) runLintCommand(`"${sampleNamePrefix}*"`);
