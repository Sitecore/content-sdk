import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLRobotsService } from '@sitecore-content-sdk/core/site';
import { createGraphQLClientFactory } from '../client';
import { SitecoreConfig } from '../config';

export interface RobotsMiddlewareConfig {
  /**
   * Sitecore configuration
   */
  config: SitecoreConfig;
  /**
   * Function to resolve site from hostname
   * @param {string} hostname The hostname to resolve
   * @returns {object} The resolved site information
   */
  siteResolver: (hostname: string) => { name: string };
  /**
   * The name of the site to use for the robots.txt file
   */
  siteName: string;
}

/**
 * Middleware for handling robots.txt requests
 */
export class RobotsMiddleware {
  private config: SitecoreConfig;
  private siteResolver: (hostname: string) => { name: string };

  constructor(protected middlewareConfig: RobotsMiddlewareConfig) {
    this.config = middlewareConfig.config;
    this.siteResolver = middlewareConfig.siteResolver;
  }

  /**
   * Handles robots.txt API requests
   * @param {NextApiRequest} req Next.js API request
   * @param {NextApiResponse} res Next.js API response
   * @returns {Promise<void>}
   */
  handle = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    res.setHeader('Content-Type', 'text/plain');

    // Resolve site based on hostname
    const hostName = req.headers.host?.split(':')[0] || 'localhost';
    const site = this.siteResolver(hostName);

    // Create GraphQLRobotsService using resolved site name
    const robotsService = new GraphQLRobotsService({
      clientFactory: createGraphQLClientFactory({ api: this.config.api }),
      siteName: site.name,
    });

    const robotsResult = await robotsService.fetchRobots();

    return res.status(200).send(robotsResult);
  };
}

/**
 * Creates a handler for robots.txt API requests
 * @param {RobotsMiddlewareConfig} config Configuration for the robots middleware
 * @returns {Function} Next.js API route handler
 */
export function createRobotsHandler(config: RobotsMiddlewareConfig) {
  const middleware = new RobotsMiddleware(config);
  return middleware.handle;
}
