import { Question } from 'inquirer';
import path from 'path';
import { type ScaffoldInitData } from '@sitecore-content-sdk/cli/scaffolding';
import { readVersions } from './common';
const defaultName = 'content-sdk-angular';

export const prompts: Question[] = [
  {
    type: 'input',
    name: 'appName',
    message: 'What would you like to name your application?',
    default: defaultName,
    when: (answers: { [key: string]: unknown }): boolean => {
      if (answers.yes && !answers.appName) {
        answers.appName = defaultName;
      }
      return !answers.appName;
    },
  },
];

export const AngularInit: ScaffoldInitData<Question> = {
  name: 'angular',
  prompts,
  templatePath: path.resolve(__dirname, '../templates/angular'),
  versions: readVersions(),
};
