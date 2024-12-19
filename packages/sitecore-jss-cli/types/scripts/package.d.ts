export declare const command = "package";
export declare const describe = "Generates a JSS manifest package file that can be deployed to Sitecore. Nothing is deployed. See also jss deploy package, which takes the package and deploys it to Sitecore. `jss package --help` for options.";
export declare const builder: {
    appName: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    manifestSourceFiles: {
        requiresArgs: boolean;
        describe: string;
        type: string;
        default: string[];
    };
    require: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: string;
    };
    manifestOutputPath: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: string;
    };
    includeContent: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: boolean;
        alias: string;
    };
    includeDictionary: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: boolean;
        alias: string;
    };
    language: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        alias: string;
    };
    rootPlaceholders: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        alias: string;
    };
    wipe: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        alias: string;
        default: boolean;
    };
    unattendedWipe: {
        requiresArgs: boolean;
        hidden: boolean;
        type: string;
    };
    pipelinePatchFiles: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: string[];
    };
    debug: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: boolean;
    };
    allowConflictingPlaceholderNames: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: boolean;
        alias: string;
    };
    packageOutputPath: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: string;
    };
    skipManifest: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: boolean;
    };
};
/**
 * @param {any} argv
 */
export declare function handler(argv: any): Promise<unknown>;
