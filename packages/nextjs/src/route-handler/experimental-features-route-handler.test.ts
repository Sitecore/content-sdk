/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextRequest } from 'next/server';
import proxyquire from 'proxyquire';
import { QUERY_PARAM_EDITING_SECRET } from '@sitecore-content-sdk/content/editing';
import { ExperimentalFeatureData } from '../experimental-features';

chai.use(sinonChai);

describe('createExperimentalFeaturesRouteHandler', () => {
  const sandbox = sinon.createSandbox();
  let experimentalFeaturesRouteHandlerModule: any;
  let getEditingSecretStub: sinon.SinonStub;
  let getEnforcedCorsHeadersStub: sinon.SinonStub;
  let handler: any;
  let req: Partial<NextRequest>;
  let OriginalResponse: typeof Response;

  const allowedOrigin = 'https://allowed.com';
  const secret = 'jss-editing-secret-mock';

  const features: ExperimentalFeatureData[] = [
    {
      idName: 'feature-one',
      displayName: 'Feature One',
      envVarName: 'CSDK_EXPERIMENTAL_FEATURE_ONE',
      description: 'First experimental feature',
    },
  ];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  beforeEach(() => {
    getEditingSecretStub = sandbox.stub().returns(secret);
    getEnforcedCorsHeadersStub = sandbox.stub().returns(corsHeaders);
    delete process.env.CSDK_EXPERIMENTAL_FEATURE_ONE;

    experimentalFeaturesRouteHandlerModule = proxyquire(
      './experimental-features-route-handler',
      {
        '../utils/utils': { getEditingSecret: getEditingSecretStub },
        '@sitecore-content-sdk/core/tools': {
          getEnforcedCorsHeaders: getEnforcedCorsHeadersStub,
        },
      }
    );

    OriginalResponse = (globalThis as any).Response;
    (globalThis as any).Response = sinon.stub().callsFake((body, options) => {
      return {
        headers: options?.headers,
        status: options?.status,
        body,
      };
    });

    handler = experimentalFeaturesRouteHandlerModule.createExperimentalFeaturesRouteHandler({
      features,
    });
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
    (globalThis as any).Response = OriginalResponse;
    delete process.env.CSDK_EXPERIMENTAL_FEATURE_ONE;
  });

  describe('GET handler', () => {
    beforeEach(() => {
      req = {
        method: 'GET',
        headers: new Headers({
          origin: allowedOrigin,
        }),
        nextUrl: {
          searchParams: new URLSearchParams({
            [QUERY_PARAM_EDITING_SECRET]: secret,
          }),
        } as any,
      };
    });

    it('should return 401 for invalid origin', async () => {
      getEnforcedCorsHeadersStub.returns(null);

      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.equal(JSON.stringify({ message: 'Invalid origin' }));
    });

    it('should return 401 for missing editing secret', async () => {
      req.nextUrl!.searchParams = new URLSearchParams();

      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.equal(JSON.stringify({ message: 'Missing or invalid editing secret' }));
    });

    it('should return 401 for invalid editing secret', async () => {
      req.nextUrl!.searchParams = new URLSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: 'wrong-secret',
      });

      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.equal(JSON.stringify({ message: 'Missing or invalid editing secret' }));
    });

    it('should return 200 with feature statuses for valid request', async () => {
      process.env.CSDK_EXPERIMENTAL_FEATURE_ONE = '1';

      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal(
        JSON.stringify({
          features: [
            {
              ...features[0],
              enabled: true,
            },
          ],
        })
      );
      expect(res.headers['Content-Type']).to.equal('application/json');
      expect(res.headers).to.deep.include(corsHeaders);
    });

    it('should return 500 for unexpected errors', async () => {
      getEditingSecretStub.throws(new Error('Unexpected error'));

      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(500);
      expect(res.body).to.equal('Internal Server Error');
    });
  });

  describe('OPTIONS handler', () => {
    beforeEach(() => {
      req = {
        method: 'OPTIONS',
        headers: new Headers({
          origin: allowedOrigin,
        }),
        nextUrl: {
          searchParams: new URLSearchParams({
            [QUERY_PARAM_EDITING_SECRET]: secret,
          }),
        } as any,
      };
    });

    it('should return 401 for invalid origin', async () => {
      getEnforcedCorsHeadersStub.returns(null);

      const res = await handler.OPTIONS(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.equal(JSON.stringify({ message: 'Invalid origin' }));
    });

    it('should return 204 for valid preflight request', async () => {
      const res = await handler.OPTIONS(req as NextRequest);

      expect(res.status).to.equal(204);
      expect(res.body).to.equal(null);
      expect(res.headers).to.deep.equal(corsHeaders);
    });
  });
});
