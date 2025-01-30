import chalk from 'chalk';
import path, { sep } from 'path';
import { installPackages, lintFix, nextSteps, BaseArgs, saveConfiguration } from './common';
import { InitializerFactory } from './InitializerFactory';

export const initialize = async (template: string, args: BaseArgs) => {
  let nextStepsText: string | undefined = '';
  let appName: string = '';

  const initFactory = new InitializerFactory();

  const runner = async (template: string): Promise<void> => {
    const initializer = await initFactory.create(template);
    if (!initializer) {
      throw new RangeError(`Unknown template '${template}'`);
    }

    args.silent || console.log(chalk.cyan(`Initializing '${template}'...`));
    const response = await initializer.init(args);

    appName = response.appName;

    nextStepsText = response.nextSteps;
  };

  await runner(template);

  saveConfiguration(args.template, path.resolve(`${args.destination}${sep}package.json`));

  // final steps (install, lint)
  if (!args.noInstall) {
    installPackages(args.destination, args.silent);
    lintFix(args.destination, args.silent);
  }

  if (!args.silent) {
    nextSteps(appName, nextStepsText);
  }
};
