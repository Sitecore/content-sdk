export declare const command = "app";
export declare const describe = "Deploys files and items for the app to Sitecore. `jss deploy app --help` for options.";
export declare const builder: {
    source: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    destination: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    config: {
        requiresArg: boolean;
        type: string;
        describe: string;
        default: string;
    };
    exclude: {
        requiresArg: boolean;
        type: string;
        describe: string;
        default: string[];
    };
    skipBuild: {
        requiresArg: boolean;
        type: string;
        describe: string;
        default: boolean;
    };
    buildTaskName: {
        requiresArg: boolean;
        type: string;
        describe: string;
        default: string;
    };
    clean: {
        requiresArg: boolean;
        type: string;
        describe: string;
        default: boolean;
    };
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
export declare function handler(argv: any): Promise<void>;
