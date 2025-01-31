import { Answers, DistinctQuestion } from 'inquirer';

/**
 * A base set of CLI answers for the client-side app
 */
export type BaseAppAnswer = Answers & {};

/**
 * A base set of CLI prompts for the client-side app
 */
export const baseAppPrompts: DistinctQuestion<BaseAppAnswer>[] = [];
