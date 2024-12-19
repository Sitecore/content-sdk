export declare const command = "clean";
export declare const describe = "Cleans the contents of a directory, by default the buildArtifactsPath.";
export declare const builder: {
    path: {
        requiresArgs: boolean;
        type: string;
        describe: string;
    };
};
/**
 * @param {any} argv
 */
export declare function handler(argv: any): Promise<void>;
