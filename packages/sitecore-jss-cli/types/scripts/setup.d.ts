export declare const command = "setup";
export declare const describe = "Sets up the scjssconfig.json config file, which defines how this application connects to a Sitecore instance for content or deployment.";
export declare const builder: {
    instancePath: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    deployUrl: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    layoutServiceHost: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    apiKey: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    deploySecret: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    nonInteractive: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    outputFile: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
    skipValidation: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
};
/**
 * @param {any} argv
 */
export declare function handler(argv: any): Promise<void>;
