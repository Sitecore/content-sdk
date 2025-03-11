import type { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLRobotsService } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import scClient from 'lib/sitecore-client';
import { createGraphQLClientFactory } from '@sitecore-content-sdk/nextjs/client';

const robotsApi = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  res.setHeader('Content-Type', 'text/plain');

  // Resolve site based on hostname
  const hostName = req.headers['host']?.split(':')[0] || 'localhost';
  const site = scClient.resolveSite(hostName);

  // create robots graphql service
  const robotsService = new GraphQLRobotsService({
    clientFactory: createGraphQLClientFactory({ api: scConfig.api }),
    siteName: site.name,
  });

  const robotsResult = await robotsService.fetchRobots();

  return res.status(200).send(robotsResult);
};

export default robotsApi;
