/* eslint-disable no-unused-expressions */
import { NextApiRequest, NextApiResponse } from 'next';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { RobotsMiddleware, createRobotsHandler } from './robots-middleware';
import { GraphQLRobotsService } from '@sitecore-content-sdk/core/site';
import * as clientModule from '../client';

describe('RobotsMiddleware', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: NextApiResponse;
  let mockConfig: any;
  let mockGraphQLClientFactory: any;
  let mockRobotsService: any;
  let createGraphQLClientFactoryStub: any;

  beforeEach(() => {
    mockReq = {
      headers: {
        host: 'example.com',
      },
    } as Partial<NextApiRequest>;

    mockRes = {} as NextApiResponse;
    mockRes.setHeader = spy(() => {
      return mockRes;
    });
    mockRes.status = spy(() => {
      return mockRes;
    });
    mockRes.send = spy(() => {
      return mockRes;
    });

    mockGraphQLClientFactory = {};
    // Properly stub the createGraphQLClientFactory function
    createGraphQLClientFactoryStub = stub(clientModule, 'createGraphQLClientFactory').returns(
      mockGraphQLClientFactory
    );

    mockRobotsService = {
      fetchRobots: stub().resolves('User-agent: *\nDisallow: /admin/'),
    };

    stub(GraphQLRobotsService.prototype, 'fetchRobots').callsFake(mockRobotsService.fetchRobots);

    mockConfig = {
      config: {
        api: {
          // Add proper API configuration to prevent the error
          edge: {
            contextId: 'test-context-id',
            edgeUrl: 'https://edge.sitecorecloud.io',
          },
          // Include local config as fallback
          local: {
            apiKey: 'test-api-key',
            apiHost: 'https://test-endpoint.com',
            path: '/api/graphql/v1',
          },
        },
      },
      siteResolver: stub().returns({ name: 'test-site' }),
      siteName: 'test-site',
    };
  });

  afterEach(() => {
    // Restore the stub properly
    createGraphQLClientFactoryStub.restore();
    (GraphQLRobotsService.prototype.fetchRobots as any).restore();
  });

  describe('handle', () => {
    it('should set the correct content type header', async () => {
      const middleware = new RobotsMiddleware(mockConfig);
      await middleware.handle(mockReq as NextApiRequest, mockRes);

      expect(mockRes.setHeader).to.have.been.calledWith('Content-Type', 'text/plain');
    });

    it('should resolve the site based on hostname', async () => {
      const middleware = new RobotsMiddleware(mockConfig);
      await middleware.handle(mockReq as NextApiRequest, mockRes);

      expect(mockConfig.siteResolver).to.have.been.calledWith('example.com');
    });

    it('should use localhost as default hostname if host header is missing', async () => {
      mockReq.headers = {};
      mockReq.headers.host = undefined;
      const middleware = new RobotsMiddleware(mockConfig);
      await middleware.handle(mockReq as NextApiRequest, mockRes);

      expect(mockConfig.siteResolver).to.have.been.calledWith('localhost');
    });
    it('should strip port from hostname if present', async () => {
      mockReq.headers = {};
      mockReq.headers.host = 'example.com:3000';
      const middleware = new RobotsMiddleware(mockConfig);
      await middleware.handle(mockReq as NextApiRequest, mockRes);

      expect(mockConfig.siteResolver).to.have.been.calledWith('example.com');
    });

    it('should return robots.txt content with 200 status', async () => {
      const middleware = new RobotsMiddleware(mockConfig);
      await middleware.handle(mockReq as NextApiRequest, mockRes);

      expect(mockRes.status).to.have.been.calledWith(200);
      expect(mockRes.send).to.have.been.calledWith('User-agent: *\nDisallow: /admin/');
    });
  });

  describe('createRobotsHandler', () => {
    it('should create a middleware instance and return its handle method', async () => {
      const handler = createRobotsHandler(mockConfig);

      // Call the handler and verify it works as expected
      await handler(mockReq as NextApiRequest, mockRes);

      expect(mockRes.setHeader).to.have.been.calledWith('Content-Type', 'text/plain');
      expect(mockRes.status).to.have.been.calledWith(200);
      expect(mockRes.send).to.have.been.calledWith('User-agent: *\nDisallow: /admin/');
    });
  });
});
