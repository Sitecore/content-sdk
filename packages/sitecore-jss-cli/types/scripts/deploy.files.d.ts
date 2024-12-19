export declare const command = "files";
export declare const describe = "Deploys the app's build artifact files to the Sitecore server using a direct file copy (no Sitecore items will be deployed). `jss deploy files --help` for options.";
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
};
/**
 * @param {any} argv
 */
export declare function handler(argv: any): Promise<void>;
