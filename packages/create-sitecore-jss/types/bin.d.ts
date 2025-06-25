import { ParsedArgs } from 'minimist';
export declare const parseArgs: () => ParsedArgs;
export declare const getDestination: (args: ParsedArgs, template: string) => Promise<any>;
export declare const promptDestination: (prompt: string, defaultDestination: string) => Promise<any>;
export declare const main: (args: ParsedArgs) => Promise<void>;
