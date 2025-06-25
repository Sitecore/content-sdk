import { Data } from 'ejs';
import { BaseAppArgs } from '../base/args';
export type JsonPropertyType = number | string | boolean | (number | string)[] | JsonObjectType;
export type JsonObjectType = {
    [key: string]: JsonPropertyType;
};
export declare const populateEjsData: (args: BaseAppArgs, destination?: string) => Data;
type TransformOptions = {
    /**
     * Determines whether a file should be copied only (not rendered through ejs)
     * Can be used if you need additional logic instead of just using `fileForCopyRegExp`
     * @param {string} file path to a file
     * @param {RegExp} fileForCopyRegExp default RegExp used for determination
     */
    isFileForCopy?: (file: string, fileForCopyRegExp: RegExp) => boolean;
    /**
     * Determines whether a file should be skiped (not copied/rendered).
     * @param {string} file path to a file
     */
    isFileForSkip?: (file: string) => boolean;
    /**
     * Custom RegExp to determine which files should be copied only (not rendered through ejs)
     * @default FILE_FOR_COPY_REGEXP
     */
    fileForCopyRegExp?: RegExp;
};
/**
 * Handles each template file and applies ejs renderer, also:
 * - Determines files for copy.
 * - Determines files for skip.
 * @param {string} templatePath path to the template
 * @param {BaseArgs} args CLI arguments
 * @param {TransformOptions} options custom options
 */
export declare const transform: (templatePath: string, args: BaseAppArgs, options?: TransformOptions) => Promise<void>;
export {};
