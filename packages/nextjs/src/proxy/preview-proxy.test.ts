/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { NextRequest, NextResponse } from 'next/server';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { EDITING_PARAMS_HEADER } from '../editing/constants';
import { PreviewProxy } from './preview-proxy';
import { PREVIEW_COOKIES } from '../editing/utils';

chai.use(sinonChai);
const expect = chai.expect;

const createClientStub = () => ({
  getPreview: sinon.stub(),
  getPage: sinon.stub(),
});

const createRequest = (props: Record<string, any> = {}) => {
  const req = {
    nextUrl: {
      pathname: '/about',
      locale: undefined,
      defaultLocale: undefined,
      clone() {
        return Object.assign({}, req.nextUrl);
      },
      ...(props.nextUrl || {}),
    },
    headers: {
      get(key: string) {
        const headers: Record<string, string | undefined> = {
          host: 'foo.net',
          ...(props.headerValues || {}),
        };
        return headers[key] ?? null;
      },
    },
    cookies: {
      get(cookieName: string) {
        const cookies: Record<string, string | undefined> = {
          ...(props.cookieValues || {}),
        };
        const value = cookies[cookieName];
        return value === undefined ? undefined : { value };
      },
    },
  } as unknown as NextRequest;

  return req;
};

const createResponse = (props: Record<string, any> = {}) => {
  const headerStore: Record<string, string> = { ...(props.headerValues || {}) };
  const cookieStore: Record<string, string> = { ...(props.cookieValues || {}) };

  const res = {
    headers: {
      get(key: string) {
        return headerStore[key] ?? null;
      },
      set(key: string, value: string) {
        headerStore[key] = value;
      },
    },
    cookies: {
      // eslint-disable-next-line no-unused-vars
      set(key: string, value: string, _attributes?: Record<string, unknown>) {
        cookieStore[key] = value;
      },
      get(key: string) {
        return { value: cookieStore[key] };
      },
    },
    json: sinon.stub().callsFake((body, options) => {
      return {
        headers: options?.headers,
        status: options?.status,
        body,
      };
    }),
  } as unknown as NextResponse;

  return res;
};

describe('PreviewProxy', () => {
  const sandbox = sinon.createSandbox();
  let clientStub: ReturnType<typeof createClientStub>;
  let proxy: PreviewProxy;
  const originalSitecoreEnv = process.env.SITECORE;

  beforeEach(() => {
    clientStub = createClientStub();
    proxy = new PreviewProxy({ client: clientStub as any });
    sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
    if (originalSitecoreEnv === undefined) {
      delete process.env.SITECORE;
    } else {
      process.env.SITECORE = originalSitecoreEnv;
    }
  });

  describe('when SITECORE env is not set (external host)', () => {
    beforeEach(() => {
      delete process.env.SITECORE;
    });

    it('should return the response unchanged without invoking the authorization', async () => {
      const req = createRequest();
      const res = createResponse();

      const result = await proxy.handle(req, res);

      expect(result).to.equal(res);
      expect(clientStub.getPreview).to.not.have.been.called;
      expect(clientStub.getPage).to.not.have.been.called;
    });
  });

  describe('when SITECORE env is set (internal editing host)', () => {
    beforeEach(() => {
      process.env.SITECORE = 'true';
    });

    describe('preview branch (EDITING_PARAMS_HEADER present)', () => {
      const editingOptions = {
        site: 'my-site',
        itemId: 'item-id',
        language: 'en',
        mode: 'preview',
      };

      it('should parse the header and call getPreview with Authorization forwarded', async () => {
        const req = createRequest({
          headerValues: {
            [EDITING_PARAMS_HEADER]: JSON.stringify(editingOptions),
            Authorization: 'Bearer abc',
          },
        });
        const res = createResponse();
        clientStub.getPreview.resolves({} as any);

        const result = await proxy.handle(req, res);

        expect(clientStub.getPreview).to.have.been.calledOnceWithExactly(editingOptions, {
          headers: { Authorization: 'Bearer abc' },
        });
        expect(clientStub.getPage).to.not.have.been.called;
        expect(result).to.equal(res);
      });

      it('should forward an empty Authorization when the header is absent', async () => {
        const req = createRequest({
          headerValues: {
            [EDITING_PARAMS_HEADER]: JSON.stringify(editingOptions),
          },
        });
        const res = createResponse();
        clientStub.getPreview.resolves({} as any);

        await proxy.handle(req, res);

        expect(clientStub.getPreview).to.have.been.calledOnceWithExactly(editingOptions, {
          headers: { Authorization: '' },
        });
      });

      it('should respond with 403 when getPreview resolves null', async () => {
        const req = createRequest({
          headerValues: {
            [EDITING_PARAMS_HEADER]: JSON.stringify(editingOptions),
            Authorization: 'Bearer abc',
          },
        });
        const res = createResponse();
        clientStub.getPreview.resolves(null);

        const fakeForbidden = { status: 403 } as unknown as NextResponse;
        const jsonStub = sandbox.stub(NextResponse, 'json').returns(fakeForbidden);

        const result = await proxy.handle(req, res);

        expect(jsonStub).to.have.been.calledOnceWithExactly(
          { html: 'Preview content is not found or access is denied' },
          { status: 403 }
        );
        expect(result).to.equal(fakeForbidden);
      });

      it('should skip and return response unchanged when mode is not preview or edit', async () => {
        const editEditingOptions = { ...editingOptions, mode: 'normal' };
        const req = createRequest({
          headerValues: {
            [EDITING_PARAMS_HEADER]: JSON.stringify(editEditingOptions),
            Authorization: 'Bearer abc',
          },
        });
        const res = createResponse();

        const result = await proxy.handle(req, res);

        expect(result).to.equal(res);
        expect(clientStub.getPreview).to.not.have.been.called;
        expect(clientStub.getPage).to.not.have.been.called;
      });

      it('should set authorization token cookie to the response', async () => {
        const req = createRequest({
          headerValues: {
            [EDITING_PARAMS_HEADER]: JSON.stringify(editingOptions),
            Authorization: 'Bearer abc',
          },
        });
        const res = createResponse();
        clientStub.getPreview.resolves({} as any);

        const result = await proxy.handle(req, res);

        expect(result.cookies.get(PREVIEW_COOKIES.PREVIEW_TOKEN)?.value).to.equal('Bearer abc');
        expect(result).to.equal(res);
      });

      it('should handle 403 response from getPreview', async () => {
        const req = createRequest({
          headerValues: {
            [EDITING_PARAMS_HEADER]: JSON.stringify(editingOptions),
            Authorization: 'Bearer abc',
          },
        });
        const res = createResponse();

        clientStub.getPreview.rejects({ response: { status: 403 } });

        sandbox.stub(NextResponse, 'json').callsFake((body, options) => {
          return {
            headers: options?.headers,
            status: options?.status,
            body,
          } as unknown as NextResponse;
        });

        const result = await proxy.handle(req, res);

        expect(result.status).to.equal(403);
        expect(result.body).to.deep.equal({
          html: 'Preview content is not found or access is denied',
        });
        expect(clientStub.getPreview).to.have.been.calledOnce;
      });
    });

    describe('path branch (EDITING_PARAMS_HEADER absent)', () => {
      it('should call getPage with pathname, site cookie, locale and Authorization header', async () => {
        const req = createRequest({
          nextUrl: { pathname: '/about', locale: 'de-DE' },
          headerValues: { Authorization: 'Bearer xyz' },
          cookieValues: { [SITE_KEY]: 'my-site' },
        });
        const res = createResponse();
        clientStub.getPage.resolves({} as any);

        const result = await proxy.handle(req, res);

        expect(clientStub.getPage).to.have.been.calledOnceWithExactly(
          '/about',
          { site: 'my-site', locale: 'de-DE' },
          { headers: { Authorization: 'Bearer xyz' } }
        );
        expect(clientStub.getPreview).to.not.have.been.called;
        expect(result).to.equal(res);
      });

      it('should respond with 403 when getPage resolves null', async () => {
        const req = createRequest({
          nextUrl: { pathname: '/about', locale: 'en' },
          headerValues: { Authorization: 'Bearer abc' },
          cookieValues: { [SITE_KEY]: 'my-site' },
        });
        const res = createResponse();
        clientStub.getPage.resolves(null);

        const fakeForbidden = { status: 403 } as unknown as NextResponse;
        const jsonStub = sandbox.stub(NextResponse, 'json').returns(fakeForbidden);

        const result = await proxy.handle(req, res);

        expect(jsonStub).to.have.been.calledOnceWithExactly(
          { html: 'Preview content is not found or access is denied' },
          { status: 403 }
        );
        expect(result).to.equal(fakeForbidden);
      });

      it('should set authorization token cookie to the response', async () => {
        const req = createRequest({
          nextUrl: { pathname: '/about', locale: 'en' },
          cookieValues: { [SITE_KEY]: 'my-site', [PREVIEW_COOKIES.PREVIEW_TOKEN]: 'Bearer abc' },
        });

        const res = createResponse();
        clientStub.getPage.resolves({} as any);

        const result = await proxy.handle(req, res);

        expect(result.cookies.get(PREVIEW_COOKIES.PREVIEW_TOKEN)?.value).to.equal('Bearer abc');
        expect(result).to.equal(res);
      });

      it('should handle 403 response from getPage', async () => {
        const req = createRequest({
          nextUrl: { pathname: '/about', locale: 'en' },
          cookieValues: { [SITE_KEY]: 'my-site', [PREVIEW_COOKIES.PREVIEW_TOKEN]: 'Bearer abc' },
        });
        const res = createResponse();
        clientStub.getPage.rejects({ response: { status: 403 } });

        sandbox.stub(NextResponse, 'json').callsFake((body, options) => {
          return {
            headers: options?.headers,
            status: options?.status,
            body,
          } as unknown as NextResponse;
        });

        const result = await proxy.handle(req, res);

        expect(result.status).to.equal(403);
        expect(result.body).to.deep.equal({
          html: 'Preview content is not found or access is denied',
        });
        expect(clientStub.getPage).to.have.been.calledOnce;
      });
    });
  });
});
