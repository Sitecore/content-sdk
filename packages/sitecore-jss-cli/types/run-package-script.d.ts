import { SpawnSyncOptionsWithStringEncoding } from 'child_process';
/**
 * @param {string[]} args
 * @param {SpawnSyncOptionsWithStringEncoding} [options]
 */
export default function runPackageScript(args: string[], options?: SpawnSyncOptionsWithStringEncoding): void;
/**
 * @param {string[]} npmArgs
 * @param {SpawnSyncOptionsWithStringEncoding} options
 */
export declare function runPackageManagerCommand(npmArgs: string[], options?: SpawnSyncOptionsWithStringEncoding): void;
/**
 * @param {string[]} args to transform
 */
export declare function transformPackageArgs(args: string[]): string[];
