import { CommandModule, Arguments } from 'yargs';
/**
 * Get package script commands
 */
export declare function getPackageScriptCommands(): Promise<{
    [key: string]: CommandModule<{}, {}>;
}>;
/**
 * @param {string} script script name
 */
export declare function makeCommand(script: string): {
    command: string;
    describe: string;
    builder: {};
    disableStrictArgs: boolean;
    handler: (argv: Arguments) => void;
};
/**
 * implements CLI commands when executed from a local node_modules folder
 */
export default function (): Promise<void>;
