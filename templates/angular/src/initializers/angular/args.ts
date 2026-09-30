import { BaseAppArgs } from '../../scaffolding';
import { AngularAnswer } from './prompts';

export type AngularArgs = BaseAppArgs & Partial<AngularAnswer>;
