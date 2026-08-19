/* eslint-disable no-unused-expressions */
import { NextApiRequest, NextApiResponse } from 'next';
import { spy } from 'sinon';
import { expect } from 'chai';
import { QUERY_PARAM_EDITING_SECRET } from '@sitecore-content-sdk/content/editing';
import { ExperimentalFeaturesMiddleware } from './experimental-features-middleware';
import experimentalFeaturesCatalog from '../experimental.json';

type Query = {
  [key: string]: string;
};

const allowedOrigin = 'https://allowed.com';

const mockRequest = (method: string, query?: Query, headers?: { [key: string]: string }) => {
  return {
    method,
    query: query ?? {},
    headers: {
      origin: allowedOrigin,
      ...headers,
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
  res.json = spy(() => {
    return res;
  });
  res.setHeader = spy(() => {
    return res;
  });
  res.getHeader = spy(() => {
    return undefined;
  });
  return res;
};

const expectedResultForbidden = { message: 'Missing or invalid editing secret' };

const expectedCatalog = [
  {
    ...experimentalFeaturesCatalog[0],
    enabled: true,
  },
  {
    ...experimentalFeaturesCatalog[1],
    enabled: false,
  },
];

describe('ExperimentalFeaturesMiddleware', () => {
  const secret = 'jss-editing-secret-mock';

  beforeEach(() => {
    process.env.SITECORE_EDITING_SECRET = secret;
    process.env.JSS_ALLOWED_ORIGINS = allowedOrigin;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE_TWO;
  });

  afterEach(() => {
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE_TWO;
  });

  after(() => {
    delete process.env.SITECORE_EDITING_SECRET;
    delete process.env.JSS_ALLOWED_ORIGINS;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE_TWO;
  });

  it('should respond with 401 for missing secret', async () => {
    const req = mockRequest('GET', {});
    const res = mockResponse();
    const handler = new ExperimentalFeaturesMiddleware().getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledWith(expectedResultForbidden);
  });

  it('should stop request and return 401 when CORS match is not met', async () => {
    const req = mockRequest('GET', {}, { origin: 'https://notallowed.com' });
    const res = mockResponse();
    const handler = new ExperimentalFeaturesMiddleware().getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledWith({ message: 'Invalid origin' });
  });

  it('should respond with 401 for invalid secret', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = 'wrongsekret';
    const req = mockRequest('GET', query);
    const res = mockResponse();
    const handler = new ExperimentalFeaturesMiddleware().getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledWith(expectedResultForbidden);
  });

  it('should respond with 204 for preflight OPTIONS request', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;
    const req = mockRequest('OPTIONS', query);
    const res = mockResponse();
    const handler = new ExperimentalFeaturesMiddleware().getHandler();

    await handler(req, res);

    const setHeaders = res.setHeader.getCalls().map((call) => call.args);

    expect(setHeaders).to.deep.include(['Access-Control-Allow-Origin', allowedOrigin]);
    expect(res.status).to.have.been.calledWith(204);
    expect(res.send).to.have.been.calledOnceWith(null);
  });

  it('should respond with 200 and the package catalog feature statuses', async () => {
    process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE = 'true';

    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;
    const req = mockRequest('GET', query);
    const res = mockResponse();
    const handler = new ExperimentalFeaturesMiddleware().getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith({ features: expectedCatalog });
  });
});
