import { QuestionCollection } from 'inquirer';
import { baseAppPrompts, BaseAppAnswer } from '../../common';

export enum Prerender {
  SSG = 'SSG',
  SSR = 'SSR',
}

export type NextjsAnswer = BaseAppAnswer & {
  prerender: Prerender;
};

const DEFAULT_PRERENDER = Prerender.SSG;

export const prompts: QuestionCollection<NextjsAnswer> = [
  ...baseAppPrompts,
  {
    type: 'list',
    name: 'prerender',
    message: 'How would you like to prerender your application?',
    choices: Object.values(Prerender),
    default: DEFAULT_PRERENDER,
    when: (answers: NextjsAnswer): boolean => {
      if (answers.yes && !answers.prerender) {
        answers.prerender = DEFAULT_PRERENDER;
      }
      return !answers.prerender;
    },
  },
];
