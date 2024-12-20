import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAnswer } from './prompts';
import { Initializer, transform, isDevEnvironment } from '../../common';
import { removeDevDependencies } from './remove-dev-dependencies';
import { NextjsArgs } from './args';
import { activateNpmrc } from '../../common/processes/activate-npmrc';

export default class NextjsInitializer implements Initializer {
  get isBase(): boolean {
    return true;
  }

  async init(args: NextjsArgs) {
    const answers = await inquirer.prompt<NextjsAnswer>(prompts, args);

    const templatePath = path.resolve(__dirname, '../../templates/nextjs');
    await transform(templatePath, { ...args, ...answers });
    if (!isDevEnvironment(args.destination)) {
      removeDevDependencies(args.destination);
    }

    // list of add-on initializers to be included
    const addInitializers: string[] = [];

    const response = {
      nextSteps: [],
      appName: answers.appName,
      initializers: addInitializers,
    };
    activateNpmrc(args.destination);

    return response;
  }
}
