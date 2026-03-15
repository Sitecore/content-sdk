import { expect } from 'chai';
import nock from 'nock';
import { GraphQLRequestClient, constants } from '@sitecore-content-sdk/core';
import { RobotsService } from './robots-service';
import { FetchOptions } from '../../client';

const { ERROR_MESSAGES } = constants;

const robotsQueryResultNull = {
  site: {
    siteInfo: null,
  },
};

describe('RobotsService', () => {
  const endpoint = 'http://site';
  const apiKey = 'some-api-key';
  const siteName = 'site-name';
  const clientFactory = GraphQLRequestClient.createClientFactory({
    endpoint,
    apiKey,
  });

  afterEach(() => {
    nock.cleanAll();
  });

  const mockRobotsRequest = (siteName?: string, fetchOptions?: FetchOptions) => {
    nock(endpoint, {
      reqheaders: fetchOptions?.headers,
    })
      .post('/')
      .reply(
        200,
        siteName
          ? {
              data: {
                site: {
                  siteInfo: {
                    robots: siteName,
                  },
                },
              },
            }
          : {
              data: robotsQueryResultNull,
            }
      );
  };

  describe('Fetch robots.txt', () => {
    it('should get error if robots.txt has empty sitename', async () => {
      mockRobotsRequest();

      const service = new RobotsService({ clientFactory, siteName: '' });
      await service.fetchRobots().catch((error: Error) => {
        expect(error.message).to.equal(ERROR_MESSAGES.MV_002);
      });

      return expect(nock.isDone()).to.be.false;
    });

    it('should get robots.txt', async () => {
      mockRobotsRequest(siteName);

      const service = new RobotsService({ clientFactory, siteName });
      const robots = await service.fetchRobots();
      expect(robots).to.equal(siteName);

      return expect(nock.isDone()).to.be.true;
    });

    it('should pass fetchOptions to the GraphQL client request', async () => {
      const fetchOptions = {
        headers: { 'X-Test-Header': 'true' },
        cache: 'no-store' as RequestCache,
      };

      mockRobotsRequest('User-agent: *\nDisallow: /', fetchOptions);

      const service = new RobotsService({
        siteName: 'test-site',
        clientFactory: () => new GraphQLRequestClient(endpoint),
      });

      const result = await service.fetchRobots(fetchOptions);

      expect(result).to.equal('User-agent: *\nDisallow: /');
      return expect(nock.isDone()).to.be.true;
    });
  });
});
