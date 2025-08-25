import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAppRouterAnswer } from './prompts';
import { Initializer, transform } from '../../common';
import { NextjsAppRouterArgs } from './args';

export default class NextjsAppRouterInitializer implements Initializer {
  async init(args: NextjsAppRouterArgs) {
    const answers = await inquirer.prompt<NextjsAppRouterAnswer>(prompts, args);
    const templatePath = path.resolve(__dirname, '../../templates/nextjs-app-router');

    await transform(templatePath, { ...args, ...answers });

    const response = {};
    return response;
  }
}
