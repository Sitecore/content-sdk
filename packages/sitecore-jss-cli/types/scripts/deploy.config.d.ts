export declare const command = "config";
export declare const describe = "Deploys the app's Sitecore configuration file(s) to the Sitecore server. `jss deploy config --help` for options.";
export declare const builder: {
    source: {
        requiresArg: boolean;
        type: string;
        describe: string;
        default: string;
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
};
/**
 * @param {any} argv
 */
export declare function handler(argv: any): Promise<void>;
