import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAppRouterAnswer, AppRouterVariant } from './prompts';
import { Initializer, transform } from '../../common';
import { NextjsAppRouterArgs } from './args';

export default class NextjsAppRouterInitializer implements Initializer {
  async init(args: NextjsAppRouterArgs) {
    const answers = await inquirer.prompt<NextjsAppRouterAnswer>(prompts, args);

    // Determine template path based on variant choice
    const templateName =
      answers.variant === AppRouterVariant.SKATEPARK
        ? 'nextjs-app-router-skatepark'
        : 'nextjs-app-router-basic';

    const templatePath = path.resolve(__dirname, '../../templates', templateName);

    await transform(templatePath, { ...args, ...answers });

    const response = {};
    return response;
  }
}
