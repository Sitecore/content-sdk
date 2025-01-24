import chalk from 'chalk';
import path, { sep } from 'path';
import { installPackages, lintFix, nextSteps, BaseArgs, saveConfiguration } from './common';
import { InitializerFactory } from './InitializerFactory';

export const initRunner = async (template: string, args: BaseArgs) => {
  let nextStepsArr: string[] = [];
  const appNames = new Set<string>([]);

  const initFactory = new InitializerFactory();

  const runner = async (template: string): Promise<void> => {
    const initializer = await initFactory.create(template);
    if (!initializer) {
      throw new RangeError(`Unknown template '${template}'`);
    }

    args.silent || console.log(chalk.cyan(`Initializing '${template}'...`));
    const response = await initializer.init(args);

    // We can have multiple appNames if base template requires to setup an additional standalone app (e.g. XM Cloud proxy)
    appNames.add(response.appName);
    nextStepsArr = [...nextStepsArr, ...(response.nextSteps ?? [])];
  };

  await runner(template);

  saveConfiguration(args.template, path.resolve(`${args.destination}${sep}package.json`));

  for (const destination of [args.destination, args.proxyAppDestination]) {
    if (!destination) continue;
    // final steps (install, lint)
    if (!args.noInstall) {
      installPackages(destination, args.silent);
      lintFix(destination, args.silent);
    }
  }

  if (!args.silent) {
    nextSteps([...appNames], nextStepsArr);
  }
};
