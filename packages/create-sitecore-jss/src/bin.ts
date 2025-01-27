import fs from 'fs';
import path, { sep } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { initRunner } from './init-runner';
import minimist, { ParsedArgs } from 'minimist';
import { getAllTemplates } from './common';

export const parseArgs = (): ParsedArgs => {
  // parse any command line arguments passed into `init sitecore-jss`
  // to pass to the generator prompts and skip them.
  // useful for CI and testing purposes
  const options = {
    boolean: ['appPrefix', 'force', 'noInstall', 'yes', 'silent'],
    string: ['appName', 'destination', 'proxyAppDestination', 'template'],
    default: {},
  };
  const args: ParsedArgs = minimist(process.argv.slice(2), options);

  // we need to coerce string parameters in minimist above (to prevent string options without a value e.g. `--appName` from coming in as a boolean `true`).
  // however, coersion will result in an empty string and inquirer will treat this as a valid answer value (and not prompt!).
  // we need to go back through and remove these to prevent this.
  options.string.forEach((key) => {
    args[key] === '' && delete args[key];
  });
  return args;
};

export const getDestination = async (args: ParsedArgs, template: string) => {
  if (!template) {
    throw new Error('Unable to get destinations, provided template is empty');
  }
  // validate/gather destinations
  const defaultBaseDestination = `${process.cwd()}${
    args.appName ? sep + args.appName : `${sep}${template}`
  }`;

  let destination = args.destination;
  if (!destination) {
    destination = args.yes
      ? defaultBaseDestination
      : await promptDestination(
          'Where would you like your new app created?',
          defaultBaseDestination
        );
  }

  return destination;
};

export const promptDestination = async (prompt: string, defaultDestination: string) => {
  return (
    await inquirer.prompt({
      type: 'input',
      name: 'destination',
      message: prompt,
      default: () => defaultDestination,
    })
  ).destination;
};

export const main = async (args: ParsedArgs) => {
  let template: string = '';

  // check if template was provided
  if (args._?.length > 0 && args._[0] !== undefined) {
    // use positional parameter
    template = args._[0];
  } else {
    // use --template arg
    template = args.template ? args.template : '';
  }

  // validate/gather template
  const templatePath = path.resolve(__dirname, 'templates');
  const allTemplates = getAllTemplates(templatePath);

  if (!template || !allTemplates.includes(template)) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'template',
      message: 'Which template would you like to create?',
      choices: allTemplates,
      default: 'nextjs',
    });

    template = answer.template;
  }

  const destination = await getDestination(args, template);

  if (!args.force && fs.existsSync(destination) && fs.readdirSync(destination).length > 0) {
    const answer = await inquirer.prompt({
      type: 'confirm',
      name: 'continue',
      message: `Directory '${destination}' not empty. Are you sure you want to continue?`,
    });
    if (!answer.continue) {
      process.exit();
    }
  } else {
    args.force = true;
  }

  try {
    await initRunner(template, { ...args, destination, template });
  } catch (error) {
    console.log(chalk.red('An error occurred: ', error));
    process.exit(1);
  }
};
