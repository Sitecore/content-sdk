import { QuestionCollection } from 'inquirer';
import { baseAppPrompts, BaseAppAnswer } from '../../common';

export enum Prerender {
  SSG = 'SSG',
  SSR = 'SSR',
}

export enum StarterType {
  BASIC = 'basic',
  SKATEPARK = 'skatepark',
}

export type NextjsAppRouterAnswer = BaseAppAnswer & {
  prerender: Prerender;
  starterType: StarterType;
};

const DEFAULT_PRERENDER = Prerender.SSG;
const DEFAULT_STARTER_TYPE = StarterType.BASIC;

export const prompts: QuestionCollection<NextjsAppRouterAnswer> = [
  ...baseAppPrompts,
  {
    type: 'list',
    name: 'starterType',
    message: 'Which XM Cloud starter kit would you like to use?',
    choices: [
      { name: 'Basic (Empty) - Minimal starter template', value: StarterType.BASIC },
      { name: 'Skatepark - Full demo site with components', value: StarterType.SKATEPARK },
    ],
    default: DEFAULT_STARTER_TYPE,
    when: (answers: NextjsAppRouterAnswer): boolean => {
      if (answers.yes && !answers.starterType) {
        answers.starterType = DEFAULT_STARTER_TYPE;
      }
      return !answers.starterType;
    },
  },
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
