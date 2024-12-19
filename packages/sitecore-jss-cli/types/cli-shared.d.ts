import { CommandModule } from 'yargs';
/**
 * @param {any} commands
 */
export default function cli(commands: {
    [key: string]: CommandModule & {
        disableStrictArgs?: boolean;
    };
}): Promise<void>;
