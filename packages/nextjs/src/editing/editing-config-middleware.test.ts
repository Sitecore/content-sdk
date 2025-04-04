﻿/* eslint-disable no-unused-expressions */
import { NextApiRequest, NextApiResponse } from 'next';
import { spy } from 'sinon';
import { expect } from 'chai';
import { EditingConfigMiddleware } from './editing-config-middleware';
import { QUERY_PARAM_EDITING_SECRET } from '@sitecore-content-sdk/core/editing';

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

const componentsMap = new Map<string, unknown>();
componentsMap.set('TestComponentOne', {});
componentsMap.set('TestComponentTwo', {});
const metadata = { packages: { testPackageOne: '0.1.1' } };

const expectedResultWithMetadata = {
  components: ['TestComponentOne', 'TestComponentTwo'],
  packages: { testPackageOne: '0.1.1' },
  editMode: 'metadata',
};

const expectedResultForbidden = { message: 'Missing or invalid editing secret' };

describe('EditingConfigMiddleware', () => {
  const secret = 'jss-editing-secret-mock';

  beforeEach(() => {
    process.env.JSS_EDITING_SECRET = secret;
    process.env.JSS_ALLOWED_ORIGINS = allowedOrigin;
  });

  after(() => {
    delete process.env.JSS_EDITING_SECRET;
    delete process.env.JSS_ALLOWED_ORIGINS;
  });

  it('should respond with 401 for missing secret', async () => {
    const key = 'wrongkey';
    const query = { key } as Query;
    const req = mockRequest('GET', query);
    const res = mockResponse();

    const middleware = new EditingConfigMiddleware({ components: componentsMap, metadata });
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledOnce;
    expect(res.json).to.have.been.calledWith(expectedResultForbidden);
  });

  it('should stop request and return 401 when CORS match is not met', async () => {
    const req = mockRequest('GET', {}, { origin: 'https://notallowed.com' });
    const res = mockResponse();
    const middleware = new EditingConfigMiddleware({ components: componentsMap, metadata });
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledOnce;
    expect(res.json).to.have.been.calledWith({ message: 'Invalid origin' });
  });

  it('should respond with 401 for invalid secret', async () => {
    const key = 'wrongkey';
    const query = { key } as Query;
    query[QUERY_PARAM_EDITING_SECRET] = 'wrongsekret';
    const req = mockRequest('GET', query);
    const res = mockResponse();

    const middleware = new EditingConfigMiddleware({ components: componentsMap, metadata });
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledOnce;
    expect(res.json).to.have.been.calledWith(expectedResultForbidden);
  });

  it('should respond with 204 for preflight OPTIONS request', async () => {
    const query = {} as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;
    const req = mockRequest('OPTIONS', query);
    const res = mockResponse();

    const middleware = new EditingConfigMiddleware({ components: componentsMap, metadata });
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.setHeader.getCall(0).args).to.deep.equal([
      'Access-Control-Allow-Origin',
      allowedOrigin,
    ]);
    expect(res.setHeader.getCall(1).args).to.deep.equal([
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, DELETE, PUT, PATCH',
    ]);
    expect(res.setHeader.getCall(2).args).to.deep.equal([
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    ]);
    expect(res.status).to.have.been.calledWith(204);
    expect(res.send).to.have.been.calledOnceWith(null);
  });

  const testEditingConfig = async (components: Map<string, unknown>, expectedResult) => {
    const key = 'wrongkey';
    const query = { key } as Query;
    query[QUERY_PARAM_EDITING_SECRET] = secret;
    const req = mockRequest('GET', query);
    const res = mockResponse();
    const middleware = new EditingConfigMiddleware({ components, metadata });
    const handler = middleware.getHandler();

    await handler(req, res);

    expect(res.status).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledOnce;
    expect(res.json).to.have.been.calledWith(expectedResult);
  };

  it('should respond with 200 and return config data with components array as argument', async () => {
    await testEditingConfig(componentsMap, expectedResultWithMetadata);
  });

  it('should respond with 200 and return config data with components map as argument', async () => {
    await testEditingConfig(componentsMap, expectedResultWithMetadata);
  });
});
