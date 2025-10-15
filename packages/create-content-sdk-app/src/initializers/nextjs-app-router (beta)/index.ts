import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAppRouterAnswer, StarterType } from './prompts';
import { Initializer, transform } from '../../common';
import { NextjsAppRouterArgs } from './args';

export default class NextjsAppRouterInitializer implements Initializer {
  async init(args: NextjsAppRouterArgs) {
    const answers = await inquirer.prompt<NextjsAppRouterAnswer>(prompts, args);
    const templatePath = path.resolve(__dirname, '../../templates/nextjs-app-router (beta)');

    // Skip skatepark components if basic starter is selected
    const isFileForSkip = (file: string): boolean => {
      // Normalize path separators for cross-platform compatibility
      const normalizedFile = file.replace(/\\/g, '/');
      if (
        answers.starterType === StarterType.BASIC &&
        normalizedFile.includes('src/components/skatepark')
      ) {
        return true;
      }
      return false;
    };

    await transform(templatePath, { ...args, ...answers }, { isFileForSkip });

    const response = {};
    return response;
  }
}
