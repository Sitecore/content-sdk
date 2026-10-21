import { BaseAppArgs } from '../../common';
import { AngularAnswer } from './prompts';

export type AngularArgs = BaseAppArgs & Partial<AngularAnswer>;
