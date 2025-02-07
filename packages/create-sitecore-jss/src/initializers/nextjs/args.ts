import { BaseAppArgs } from '../../common';
import { NextjsAnswer } from './prompts';

export type NextjsArgs = BaseAppArgs & Partial<NextjsAnswer>;
