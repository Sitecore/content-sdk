export declare const command = "items";
export declare const describe = "Deploys the app's Sitecore items to Sitecore. No files are deployed. `jss deploy items --help` for options.";
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
    deployUrl: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    deploySecret: {
        requiresArg: boolean;
        type: string;
        alias: string;
        describe: string;
    };
    debugSecurity: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: boolean;
    };
    skipPackage: {
        requiresArgs: boolean;
        type: string;
        describe: string;
        default: boolean;
    };
    config: {
        requiresArg: boolean;
        type: string;
        describe: string;
        default: string;
    };
    proxy: {
        requiresArgs: boolean;
        type: string;
        describe: string;
    };
    acceptCertificate: {
        requiresArgs: boolean;
        type: string;
        describe: string;
    };
};
/**
 * @param {any} argv
 */
export declare function handler(argv: any): Promise<unknown>;
