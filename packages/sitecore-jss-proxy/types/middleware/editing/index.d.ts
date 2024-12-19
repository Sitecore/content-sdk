import { NextFunction, Request, Response } from 'express';
import { EditingConfigEndpointOptions } from './config';
import { EditingRenderEndpointOptions } from './render';
/**
 * Configuration for the editing router
 */
export type EditingRouterConfig = {
    /**
     * Configuration for the /config endpoint
     */
    config: EditingConfigEndpointOptions;
    /**
     * Configuration for the /render endpoint
     */
    render: EditingRenderEndpointOptions;
};
/**
 * Middleware to handle editing requests
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {NextFunction} next Next function
 */
export declare const editingMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
/**
 * Creates a router for editing requests.
 * Supports the following routes:
 * - <routerPath>/render (GET) - renders a route
 * - <routerPath>/config (GET) - returns the current application configuration
 * @param {EditingRouterConfig} options Editing router configuration
 * @returns {Router} Editing router
 */
export declare const editingRouter: (options: EditingRouterConfig) => import("express-serve-static-core").Router;
