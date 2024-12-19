export declare const command = "manifest";
export declare const describe = "Generates a JSS manifest file which defines app assets to import into Sitecore. Nothing is deployed or added to a deployment package; this just collects assets. See `jss package`, which takes the manifest and turns it into a deployable package. `jss manifest --help` for options.";
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
};
/**
 * @param {any} argv
 */
export declare function handler(argv: any): Promise<import("@sitecore-jss/sitecore-jss-dev-tools").ManifestInstance>;
