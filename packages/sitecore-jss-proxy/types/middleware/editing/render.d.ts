import { GraphQLRequestClientFactory } from '@sitecore-jss/sitecore-jss';
import { AppRenderer } from '../../types/AppRenderer';
import { Request, Response } from 'express';
import { RenderMetadataQueryParams } from '@sitecore-jss/sitecore-jss/editing';
import { PersonalizeHelper } from '../../personalize';
/**
 * Configuration for the editing render endpoint
 */
export type EditingRenderEndpointOptions = {
    /**
     * Custom path for the endpoint. Default is `<routerPath>/render`
     * @example
     * { path: '/foo/render' } -> <routerPath>/foo/render
     */
    path?: string;
    /**
     * GraphQl Request Client Factory provided by the server bundle
     */
    clientFactory: GraphQLRequestClientFactory;
    /**
     * The appRenderer will produce the requested route's html
     */
    renderView: AppRenderer;
    /**
     * Personalize helper instance passed from proxy app
     */
    personalizeHelper?: PersonalizeHelper;
};
type MetadataRequest = Request & {
    query: RenderMetadataQueryParams;
};
/**
 * Middleware to handle editing render requests
 * @param {EditingRenderEndpointOptions} config for the endpoint
 */
export declare const editingRenderMiddleware: (config: EditingRenderEndpointOptions) => (req: MetadataRequest, res: Response) => Promise<void>;
/**
 * Gets the Content-Security-Policy header value
 * @returns {string} Content-Security-Policy header value
 */
export declare const getSCPHeader: () => string;
export {};
