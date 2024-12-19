/**
 * @param {any} argv
 * @param {string} manifestContents
 */
export default function microManifest(argv: {
    [key: string]: any;
}, manifestContents: string): Promise<void>;
/**
 *
 */
export declare function verifyArgs(argv: {
    [key: string]: any;
}): Promise<{
    [key: string]: any;
}>;
