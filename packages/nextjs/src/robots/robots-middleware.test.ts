import { expect, use } from 'chai';
import { NextApiRequest, NextApiResponse } from 'next';
import { spy, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { RobotsMiddleware, createRobotsHandler } from './robots-middleware';
import { GraphQLRobotsService } from '@sitecore-content-sdk/nextjs';
import { createGraphQLClientFactory } from '@sitecore-content-sdk/nextjs/client';

use(sinonChai);

// Mock GraphQLRobotsService
const mockFetchRobots = stub().resolves('User-agent: *\nDisallow: /admin/');
class MockGraphQLRobotsService {
  fetchRobots = mockFetchRobots;
}

// Mock createGraphQLClientFactory
const mockCreateGraphQLClientFactory = stub().returns({});

// Override the imports with our mocks
const originalGraphQLRobotsService = GraphQLRobotsService;
const originalCreateGraphQLClientFactory = createGraphQLClientFactory;

const mockRequest = (host?: string) => {
  return {
    headers: {
      host,
    },
  } as NextApiRequest;
};

const mockResponse = () => {
  const res = {} as NextApiResponse;
  res.status = spy(() => {
    return res;
  });
  res.send = spy(() => {
    return res;
  });
  res.setHeader = spy(() => {
    return res;
  });
  return res;
};

describe('RobotsMiddleware', () => {
  const mockConfig = {
    config: {
      api: {
        apiKey: 'test-api-key',
        endpoint: 'https://test-endpoint.com',
      },
    },
    siteResolver: stub().returns({ name: 'test-site' }),
  };

  before(() => {
    // Replace the real implementations with mocks
    (GraphQLRobotsService as any) = MockGraphQLRobotsService;
    (createGraphQLClientFactory as any) = mockCreateGraphQLClientFactory;
  });

  after(() => {
    // Restore the original implementations
    (GraphQLRobotsService as any) = originalGraphQLRobotsService;
    (createGraphQLClientFactory as any) = originalCreateGraphQLClientFactory;
  });

  beforeEach(() => {
    mockFetchRobots.resetHistory();
    mockCreateGraphQLClientFactory.resetHistory();
    mockConfig.siteResolver.resetHistory();
  });

  it('should initialize with the provided config', () => {
    const middleware = new RobotsMiddleware(mockConfig);

    expect(mockCreateGraphQLClientFactory).to.have.been.calledWith({
      api: mockConfig.config.api,
    });
  });

  it('should set the correct content type header', async () => {
    const req = mockRequest('test-host.com');
    const res = mockResponse();

    const middleware = new RobotsMiddleware(mockConfig);
    await middleware.handle(req, res);

    expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/plain');
  });

  it('should resolve the site based on hostname', async () => {
    const req = mockRequest('test-host.com');
    const res = mockResponse();

    const middleware = new RobotsMiddleware(mockConfig);
    await middleware.handle(req, res);

    expect(mockConfig.siteResolver).to.have.been.calledWith('test-host.com');
  });

  it('should use localhost as default hostname if host header is missing', async () => {
    const req = mockRequest(undefined);
    const res = mockResponse();

    const middleware = new RobotsMiddleware(mockConfig);
    await middleware.handle(req, res);

    expect(mockConfig.siteResolver).to.have.been.calledWith('localhost');
  });

  it('should strip port from hostname if present', async () => {
    const req = mockRequest('test-host.com:3000');
    const res = mockResponse();

    const middleware = new RobotsMiddleware(mockConfig);
    await middleware.handle(req, res);

    expect(mockConfig.siteResolver).to.have.been.calledWith('test-host.com');
  });

  it('should fetch robots data with the resolved site name', async () => {
    const req = mockRequest('test-host.com');
    const res = mockResponse();

    const middleware = new RobotsMiddleware(mockConfig);
    await middleware.handle(req, res);

    expect(mockFetchRobots).to.have.been.calledWith({
      siteName: 'test-site',
    });
  });

  it('should return a 200 status with the robots data', async () => {
    const req = mockRequest('test-host.com');
    const res = mockResponse();

    const middleware = new RobotsMiddleware(mockConfig);
    await middleware.handle(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.send).to.have.been.calledWith('User-agent: *\nDisallow: /admin/');
  });
});

describe('createRobotsHandler', () => {
  const mockConfig = {
    config: {
      api: {
        apiKey: 'test-api-key',
        endpoint: 'https://test-endpoint.com',
      },
    },
    siteResolver: stub().returns({ name: 'test-site' }),
  };

  before(() => {
    // Replace the real implementations with mocks
    (GraphQLRobotsService as any) = MockGraphQLRobotsService;
    (createGraphQLClientFactory as any) = mockCreateGraphQLClientFactory;
  });

  after(() => {
    // Restore the original implementations
    (GraphQLRobotsService as any) = originalGraphQLRobotsService;
    (createGraphQLClientFactory as any) = originalCreateGraphQLClientFactory;
  });

  it('should return a function that calls the middleware handle method', async () => {
    const req = mockRequest('test-host.com');
    const res = mockResponse();

    const handler = createRobotsHandler(mockConfig);

    expect(typeof handler).to.equal('function');

    await handler(req, res);

    expect(res.setHeader).to.have.been.calledWith('Content-Type', 'text/plain');
    expect(res.status).to.have.been.calledWith(200);
    expect(res.send).to.have.been.called;
  });
});
