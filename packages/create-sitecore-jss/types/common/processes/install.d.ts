/**
 * Executes packages installation, depending on the environment
 * @param {string} projectFolder path to the app folder
 * @param {boolean} [silent] suppress logs
 */
export declare const installPackages: (projectFolder: string, silent?: boolean) => void;
/**
 * Fixes possible linting issues
 * @param {string} projectFolder path to the app folder
 * @param {boolean} [silent] suppress logs
 */
export declare const lintFix: (projectFolder: string, silent?: boolean) => void;
