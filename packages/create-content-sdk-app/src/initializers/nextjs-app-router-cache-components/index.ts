import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAppRouterAnswer } from '../nextjs-app-router/prompts';
import { Initializer, transform } from '../../common';
import { NextjsAppRouterCacheComponentsArgs } from './args';

export default class NextjsAppRouterCacheComponentsInitializer implements Initializer {
  async init(args: NextjsAppRouterCacheComponentsArgs) {
    const answers = await inquirer.prompt<NextjsAppRouterAnswer>(prompts, args);
    const templatePath = path.resolve(__dirname, '../../templates/nextjs-app-router-cache-components');

    await transform(templatePath, { ...args, ...answers });

    return {};
  }
}
