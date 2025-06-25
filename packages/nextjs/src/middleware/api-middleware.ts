import { NextApiRequest, NextApiResponse } from 'next';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';
import { SiteInfo, SiteResolver } from '../site';

/**
 * Base class for API middleware in Next.js applications
 * Provides common functionality for handling API requests and site resolution.
 */
export abstract class ApiMiddlewareBase {
  protected client: SitecoreClient;
  protected siteResolver: SiteResolver;

  constructor(client: SitecoreClient, sites: SiteInfo[]) {
    this.client = client;
    this.siteResolver = new SiteResolver(sites);
  }

  /**
   * Returns the bound handler function for the middleware.
   * This allows the middleware to be used as a Next.js API route handler.
   * @returns Bound handler function.
   */
  getHandler() {
    return this.handler.bind(this);
  }

  /**
   * Retrieves site information based on the provided host name.
   * @param {string} hostName - The host name used to resolve the site information.
   * @returns The site information associated with the given host name.
   */
  protected getSite(hostName: string): SiteInfo {
    return this.siteResolver.getByHost(hostName);
  }

  /**
   * Handler method to execute middleware logic
   * @param {NextApiRequest} req request object from Next.js API route
   * @param {NextApiResponse} res response object from Next.js API route
   */
  protected abstract handler(req: NextApiRequest, res: NextApiResponse): Promise<void>;
}
