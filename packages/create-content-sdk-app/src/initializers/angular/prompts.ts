import { QuestionCollection } from 'inquirer';
import { baseAppPrompts, BaseAppAnswer } from '../../common';

export type AngularAnswer = BaseAppAnswer & {
  appName: string;
};

const defaultName = 'content-sdk-angular';

export const prompts: QuestionCollection<AngularAnswer> = [
  ...baseAppPrompts,
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
