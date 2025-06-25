import { BaseAppArgs, Initializer } from './common';
export declare const initialize: (template: string, args: BaseAppArgs) => Promise<void>;
export declare const getInitializer: (template: string) => Promise<Initializer>;
