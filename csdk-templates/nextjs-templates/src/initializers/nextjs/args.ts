import { BaseAppArgs } from '../../scaffolding';
import { NextjsAnswer } from './prompts';

export type NextjsArgs = BaseAppArgs & Partial<NextjsAnswer>;
