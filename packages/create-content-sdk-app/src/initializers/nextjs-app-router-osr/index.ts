import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAppRouterAnswer } from '../nextjs-app-router/prompts';
import { Initializer, transform } from '../../common';
import { NextjsAppRouterOsrArgs } from './args';

export default class NextjsAppRouterOsrInitializer implements Initializer {
  async init(args: NextjsAppRouterOsrArgs) {
    const answers = await inquirer.prompt<NextjsAppRouterAnswer>(prompts, args);
    const templatePath = path.resolve(__dirname, '../../templates/nextjs-app-router-osr');

    await transform(templatePath, { ...args, ...answers });

    return {};
  }
}
