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
import { getInitializerData } from './registry';
import inquirer from 'inquirer';

export const initialize = async (template: string, args: BaseAppArgs) => {
  const init = await getInitializerData(template, args.majorVersion);
  args.silent || console.log(chalk.cyan(`Initializing '${template}'...`));

  // Bind the resolved template package's versions so initializers render
  // templates without needing to source versions themselves.
  const ctx: InitContext = {
    transform: (templatePath, transformArgs) =>
      transform(templatePath, transformArgs, init.versions),
    baseAppPrompts,
  };
  try {
    const answers = await inquirer.prompt([...ctx.baseAppPrompts, ...init.prompts], args);
    const templatePath = init.templatePath;
    await ctx.transform(templatePath, { ...args, ...answers });
  } catch (e) {
    console.error('App scaffolding failed', e);
    process.exit(1);
  }

  // final steps (install, lint)
  if (!args.noInstall) {
    installPackages(args.destination, args.silent);
    lintFix(args.destination, args.silent);
  }

  if (!args.silent) {
    const pkg = openJsonFile(path.resolve(`${args.destination}${sep}package.json`));
    nextSteps(pkg.name, init.nextSteps);
  }
};
