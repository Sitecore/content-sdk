import { DistinctQuestion } from 'inquirer';
import { BaseAppAnswer } from '../../scaffolding';

export enum Prerender {
  SSG = 'SSG',
  SSR = 'SSR',
}

export type NextjsAppRouterAnswer = BaseAppAnswer & {
  prerender: Prerender;
};

const DEFAULT_PRERENDER = Prerender.SSG;

export const prompts: DistinctQuestion<NextjsAppRouterAnswer>[] = [
  {
    type: 'list',
    name: 'prerender',
    message: 'How would you like to prerender your application?',
    choices: Object.values(Prerender),
    default: DEFAULT_PRERENDER,
    when: (answers: NextjsAppRouterAnswer): boolean => {
      if (answers.yes && !answers.prerender) {
        answers.prerender = DEFAULT_PRERENDER;
      }
      return !answers.prerender;
    },
  },
];
