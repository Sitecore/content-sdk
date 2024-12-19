export declare const command = "environment";
export declare const describe = false;
export declare const builder: {
    name: {
        requiresArg: boolean;
        type: string;
        describe: string;
    };
};
/**
 * Environment variable handler
 * @param {any} argv
 */
export declare function handler(argv: any): void;
