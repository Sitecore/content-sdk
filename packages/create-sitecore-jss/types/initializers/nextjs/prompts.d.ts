import { QuestionCollection } from 'inquirer';
import { BaseAppAnswer } from '../../common';
export declare enum Prerender {
    SSG = "SSG",
    SSR = "SSR"
}
export type NextjsAnswer = BaseAppAnswer & {
    prerender: Prerender;
};
export declare const prompts: QuestionCollection<NextjsAnswer>;
