import { JsonObjectType } from '../processes/transform';
/**
 * Determines whether you are in a dev environment.
 * It's `true` if you are inside the monorepo
 * @param {string} [cwd] path to the current working directory
 * @returns {boolean} is a development environment
 */
export declare const isDevEnvironment: (cwd?: string) => boolean;
/**
 * Provides json data from a file
 * @param {string} jsonFilePath path to the .json file.
 * @returns json data
 */
export declare const openJsonFile: (jsonFilePath: string) => any;
/**
 * Creates a .json file and inserts provided data
 * @param {object} data data to be written into the .json file
 * @param {string} jsonFilePath a path to a file.
 */
export declare const writeJsonFile: (data: {
    [key: string]: unknown;
}, jsonFilePath: string) => void;
export declare const sortKeys: (obj: JsonObjectType) => any;
/**
 * Returns all templates
 * @returns {string[]} templates
 */
export declare const getAllTemplates: () => string[];
export declare const writeFileToPath: (destinationPath: string, content: string) => void;
export declare const removeFile: (filePath: string) => void;
