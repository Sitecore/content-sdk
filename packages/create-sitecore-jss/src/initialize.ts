import chalk from 'chalk';
import path, { sep } from 'path';
import {
  installPackages,
  lintFix,
  nextSteps,
  BaseArgs,
  saveConfiguration,
  Initializer,
} from './common';

export const initialize = async (template: string, args: BaseArgs) => {
  const initializer = await getInitializer(template);
  args.silent || console.log(chalk.cyan(`Initializing '${template}'...`));
  const response = await initializer.init(args);

  saveConfiguration(args.template, path.resolve(`${args.destination}${sep}package.json`));

  // final steps (install, lint)
  if (!args.noInstall) {
    installPackages(args.destination, args.silent);
    lintFix(args.destination, args.silent);
  }

  if (!args.silent) {
    nextSteps(response.appName, response.nextSteps);
  }
};

export const getInitializer = async (template: string): Promise<Initializer> => {
  const { default: Initializer } = await import(
    path.resolve(__dirname, 'initializers', template, 'index')
  );
  return new Initializer();
};
