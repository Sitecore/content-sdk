import { SpawnSyncOptionsWithStringEncoding } from 'child_process';
/**
 * @param {string} command
 * @param {string[]} args
 * @param {SpawnSyncOptionsWithStringEncoding} options
 * @param {boolean} silent
 */
export declare const run: (command: string, args: string[], options?: SpawnSyncOptionsWithStringEncoding, silent?: boolean) => void;
/**
 * @param {string} command
 * @param {string[]} args
 * @param {SpawnSyncOptionsWithStringEncoding} options
 * @param {NodeJS.Process} parentProcess
 */
export declare const spawnFunc: (command: string, args: string[], options?: SpawnSyncOptionsWithStringEncoding, parentProcess?: NodeJS.Process) => void;
