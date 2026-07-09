import path from 'path';
import { Initializer, transform } from '../../common';
import { AngularArgs } from './args';
import { AngularAnswer, prompts } from './prompts';
import inquirer from 'inquirer';

export default class AngularInitializer implements Initializer {
  async init(args: AngularArgs) {
    const answers = await inquirer.prompt<AngularAnswer>(prompts, args);
    const templatePath = path.resolve(__dirname, '../../templates/angular');

    await transform(templatePath, { ...args, ...answers });

    const response = {};
    return response;
  }
}
