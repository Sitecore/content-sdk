/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NextRequest } from 'next/server';
import proxyquire from 'proxyquire';
import { QUERY_PARAM_EDITING_SECRET } from '@sitecore-content-sdk/content/editing';
import { ComponentMap } from '@sitecore-content-sdk/react';
import { NextjsContentSdkComponent } from '../sharedTypes/component-props';

chai.use(sinonChai);

describe('createEditingConfigRouteHandler', () => {
  const sandbox = sinon.createSandbox();
  let editingConfigRouteHandlerModule: any;
  let getEditingSecretStub: sinon.SinonStub;
  let getEnforcedCorsHeadersStub: sinon.SinonStub;
  let handler: any;
  let req: Partial<NextRequest>;

  let OriginalResponse: typeof Response;

  const allowedOrigin = 'https://allowed.com';
  const secret = 'jss-editing-secret-mock';

  const componentsMap: ComponentMap<NextjsContentSdkComponent> = new Map();
  componentsMap.set('TestComponentOne', {} as NextjsContentSdkComponent);
  componentsMap.set('TestComponentTwo', {} as NextjsContentSdkComponent);

  const metadata = { packages: { testPackageOne: '0.1.1' } };

  const expectedResult = {
    framework: 'nextjs-approuter',
    components: ['TestComponentOne', 'TestComponentTwo'],
    clientComponents: [],
    packages: { testPackageOne: '0.1.1' },
    editMode: 'metadata',
  };

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  beforeEach(() => {
    getEditingSecretStub = sandbox.stub().returns(secret);
    getEnforcedCorsHeadersStub = sandbox.stub().returns(corsHeaders);

    editingConfigRouteHandlerModule = proxyquire('./editing-config-route-handler', {
      '../utils/utils': { getEditingSecret: getEditingSecretStub },
      '@sitecore-content-sdk/core/utils': { getEnforcedCorsHeaders: getEnforcedCorsHeadersStub },
    });

    OriginalResponse = (globalThis as any).Response;
    (globalThis as any).Response = sinon.stub().callsFake((body, options) => {
      return {
        headers: options?.headers,
        status: options?.status,
        body,
      };
    });

    handler = editingConfigRouteHandlerModule.createEditingConfigRouteHandler({
      components: componentsMap,
      metadata,
    });
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
    (globalThis as any).Response = OriginalResponse;
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
      expect(res.headers['Content-Type']).to.equal('application/json');
    });

    it('should return 401 for missing editing secret', async () => {
      req.nextUrl!.searchParams = new URLSearchParams();

      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.equal(JSON.stringify({ message: 'Missing or invalid editing secret' }));
      expect(res.headers['Content-Type']).to.equal('application/json');
    });

    it('should return 401 for invalid editing secret', async () => {
      req.nextUrl!.searchParams = new URLSearchParams({
        [QUERY_PARAM_EDITING_SECRET]: 'wrong-secret',
      });

      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(401);
      expect(res.body).to.equal(JSON.stringify({ message: 'Missing or invalid editing secret' }));
      expect(res.headers['Content-Type']).to.equal('application/json');
    });

    it('should return 200 with config data for valid request', async () => {
      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      expect(res.body).to.equal(JSON.stringify(expectedResult));
      expect(res.headers['Content-Type']).to.equal('application/json');
      expect(res.headers).to.deep.include(corsHeaders);
    });

    it('should call getEnforcedCorsHeaders with correct parameters', async () => {
      await handler.GET(req as NextRequest);

      expect(getEnforcedCorsHeadersStub).to.have.been.calledOnce;
      const args = getEnforcedCorsHeadersStub.firstCall.args[0];
      expect(args.requestMethod).to.equal('GET');
      expect(args.headers.get('origin')).to.equal(allowedOrigin);
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
      expect(res.headers['Content-Type']).to.equal('application/json');
    });

    it('should return 204 for valid preflight request', async () => {
      const res = await handler.OPTIONS(req as NextRequest);

      expect(res.status).to.equal(204);
      expect(res.body).to.equal(null);
      expect(res.headers).to.deep.equal(corsHeaders);
    });

    it('should call getEnforcedCorsHeaders with correct parameters', async () => {
      await handler.OPTIONS(req as NextRequest);

      expect(getEnforcedCorsHeadersStub).to.have.been.calledOnce;
      const args = getEnforcedCorsHeadersStub.firstCall.args[0];
      expect(args.requestMethod).to.equal('OPTIONS');
      expect(args.headers.get('origin')).to.equal(allowedOrigin);
    });
  });

  describe('component map handling', () => {
    it('should convert components map to array correctly', async () => {
      const customComponents = new Map();
      customComponents.set('Component1', {});
      customComponents.set('Component2', {});
      customComponents.set('Component3', {});

      const customHandler = editingConfigRouteHandlerModule.createEditingConfigRouteHandler({
        components: customComponents,
        metadata,
      });

      const req = {
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

      const res = await customHandler.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      const responseBody = JSON.parse(res.body);
      expect(responseBody.components).to.deep.equal(['Component1', 'Component2', 'Component3']);
      expect(responseBody.framework).to.equal('nextjs-approuter');
      expect(responseBody.clientComponents).to.deep.equal([]);
    });

    it('should include clientComponents in response when provided', async () => {
      const clientComponentsMap: ComponentMap<NextjsContentSdkComponent> = new Map();
      clientComponentsMap.set('ClientComponent1', {} as NextjsContentSdkComponent);
      clientComponentsMap.set('ClientComponent2', {} as NextjsContentSdkComponent);

      const customHandler = editingConfigRouteHandlerModule.createEditingConfigRouteHandler({
        components: componentsMap,
        clientComponents: clientComponentsMap,
        metadata,
      });

      const req = {
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

      const res = await customHandler.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      const responseBody = JSON.parse(res.body);
      expect(responseBody.framework).to.equal('nextjs-approuter');
      expect(responseBody.clientComponents).to.deep.equal(['ClientComponent1', 'ClientComponent2']);
    });

    it('should return empty clientComponents array when not provided', async () => {
      const res = await handler.GET(req as NextRequest);

      expect(res.status).to.equal(200);
      const responseBody = JSON.parse(res.body);
      expect(responseBody.framework).to.equal('nextjs-approuter');
      expect(responseBody.clientComponents).to.deep.equal([]);
    });
  });
});
