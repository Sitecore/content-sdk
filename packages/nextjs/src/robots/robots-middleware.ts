import { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLRobotsService } from '@sitecore-content-sdk/nextjs';
import { createGraphQLClientFactory } from '@sitecore-content-sdk/nextjs/client';
import { SitecoreConfig } from '@sitecore-content-sdk/nextjs/config';

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
}

/**
 * Middleware for handling robots.txt requests
 */
export class RobotsMiddleware {
  private robotsService: GraphQLRobotsService;
  private siteResolver: (hostname: string) => { name: string };

  constructor(protected config: RobotsMiddlewareConfig) {
    this.robotsService = new GraphQLRobotsService({
      clientFactory: createGraphQLClientFactory({ api: config.config.api }),
    });
    this.siteResolver = config.siteResolver;
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

    // Fetch robots data
    const robotsResult = await this.robotsService.fetchRobots({ siteName: site.name });

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
