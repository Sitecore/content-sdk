import chalk from 'chalk';
import path, { sep } from 'path';
import {
  installPackages,
  lintFix,
  nextSteps,
  BaseAppArgs,
  openJsonFile,
  InitContext,
  transform,
  baseAppPrompts,
} from './common';
import { getInitializer } from './registry';

export const initialize = async (template: string, args: BaseAppArgs) => {
  const { initializer, versions } = await getInitializer(
    template,
    args.version as string | undefined
  );
  args.silent || console.log(chalk.cyan(`Initializing '${template}'...`));

  // Bind the resolved template package's versions so initializers render
  // templates without needing to source versions themselves.
  const ctx: InitContext = {
    transform: (templatePath, transformArgs) => transform(templatePath, transformArgs, versions),
    baseAppPrompts,
  };
  const response = await initializer.init(args, ctx);

  // final steps (install, lint)
  if (!args.noInstall) {
    installPackages(args.destination, args.silent);
    lintFix(args.destination, args.silent);
  }

  if (!args.silent) {
    const pkg = openJsonFile(path.resolve(`${args.destination}${sep}package.json`));
    nextSteps(pkg.name, response.nextSteps);
  }
};
