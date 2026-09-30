import { DistinctQuestion } from 'inquirer';
import { BaseAppAnswer } from '../../scaffolding';

export type AngularAnswer = BaseAppAnswer & {
  appName: string;
};

const defaultName = 'content-sdk-angular';

export const prompts: DistinctQuestion<AngularAnswer>[] = [
  {
    type: 'input',
    name: 'appName',
    message: 'What would you like to name your application?',
    default: defaultName,
    when: (answers: AngularAnswer): boolean => {
      if (answers.yes && !answers.appName) {
        answers.appName = defaultName;
      }
      return !answers.appName;
    },
  },
];
