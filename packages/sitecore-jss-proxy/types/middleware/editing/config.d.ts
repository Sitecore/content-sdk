import { Request, Response } from 'express';
import { Metadata } from '@sitecore-jss/sitecore-jss/utils';
/**
 * Configuration for the editing config endpoint
 */
export type EditingConfigEndpointOptions = {
    /**
     * Custom path for the endpoint. Default is `<routerPath>/config`
     * @example
     * { path: '/foo/config' } -> <routerPath>/foo/config
     */
    path?: string;
    /**
     * Components registered in the application
     */
    components: string[] | Map<string, unknown>;
    /**
     * Application metadata
     */
    metadata: Metadata;
};
/**
 * Middleware to handle editing config requests
 * @param {EditingConfigEndpointOptions} config Configuration for the endpoint
 * @returns {RequestHandler} Middleware function
 */
export declare const editingConfigMiddleware: (config: EditingConfigEndpointOptions) => (_req: Request, res: Response) => void;
