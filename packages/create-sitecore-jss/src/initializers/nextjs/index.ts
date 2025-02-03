import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAnswer } from './prompts';
import { Initializer, transform, isDevEnvironment } from '../../common';
import { removeDevDependencies } from './remove-dev-dependencies';
import { NextjsArgs } from './args';

export default class NextjsInitializer implements Initializer {
  async init(args: NextjsArgs) {
    const answers = await inquirer.prompt<NextjsAnswer>(prompts, args);
    const templatePath = path.resolve(__dirname, '../../templates/nextjs');

    await transform(templatePath, { ...args, ...answers });

    if (!isDevEnvironment(args.destination)) {
      removeDevDependencies(args.destination);
    }

    const response = {};
    return response;
  }
}
