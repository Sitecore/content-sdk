import { Answers, DistinctQuestion } from 'inquirer';

/**
 * A base set of CLI answers for the app
 */
export type BaseAppAnswer = Answers & {};

/**
 * A base set of CLI prompts for the app
 */
export const baseAppPrompts: DistinctQuestion<BaseAppAnswer>[] = [];
