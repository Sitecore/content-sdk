import { Argv } from 'yargs';
/**
 * @param {Argv} yargs
 */
export default function builder(yargs: Argv): Argv<{}>;
/**
 * @param {Argv} yargs
 */
export declare function args(yargs: Argv): Argv<{
    name: string | undefined;
} & {
    displayName: string | undefined;
} & {
    fields: (string | number)[] | undefined;
} & {
    icon: string | undefined;
} & {
    appName: string | undefined;
} & {
    config: string;
} & {
    deployUrl: string | undefined;
} & {
    skipDeploy: boolean;
} & {
    acceptCertificate: string | undefined;
}>;
/**
 * @param {Argv} argv
 */
export declare function handler(argv: any): Promise<void>;
