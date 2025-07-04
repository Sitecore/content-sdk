/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { NativeDataFetcher } from './native-fetcher.js';
import debugApi from 'debug';
import debug from './debug.js';

let fetchInput: RequestInfo | URL | undefined;
let fetchInit: RequestInit | undefined;

const mockFetch = (
  status: number,
  response: unknown = {},
  {
    jsonError,
    textError,
    responseType,
    customHeaders = {},
  }: {
    jsonError?: string;
    textError?: string;
    responseType?: 'text' | 'json';
    customHeaders?: Record<string, string>;
  } = {}
) => {
  return (input: URL | RequestInfo, init?: RequestInit) => {
    fetchInput = input;
    fetchInit = init;

    const allHeaders: Record<string, string> = {
      'Content-Type': responseType === 'text' ? 'text/plain' : 'application/json',
      ...customHeaders,
    };

    return Promise.resolve({
      ok: status === 200,
      status,
      statusText: status === 200 ? 'OK' : 'ERROR',
      url: input,
      redirected: false,
      headers: {
        get: (name: string) => allHeaders[name] || '',
        set: (name: string, value: string) => {
          allHeaders[name] = value;
        },
        entries: () => Object.entries(allHeaders),
      } as unknown as Headers,
      json: () => {
        return jsonError ? Promise.reject(new Error(jsonError)) : Promise.resolve(response);
      },
      text: () => {
        return textError
          ? Promise.reject(new Error(textError))
          : Promise.resolve(JSON.stringify(response));
      },
    } as Response);
  };
};

describe('NativeDataFetcher', () => {
  let debugNamespaces: string;

  before(() => {
    debugNamespaces = debugApi.disable();
    debugApi.enable(`${debug.http.namespace},${debug.personalize.namespace}`);
  });

  beforeEach(() => {
    sinon.spy(global, 'Headers');
    debug.http.log = () => true;
    debug.personalize.log = () => true;
    sinon.spy(debug.http, 'log');
    sinon.spy(debug.personalize, 'log');
  });

  afterEach(() => {
    fetchInput = undefined;
    fetchInit = undefined;
    sinon.restore();
  });

  after(() => {
    debugApi.enable(debugNamespaces);
  });

  describe('fetch', () => {
    it('should execute request with fetch method', async () => {
      const fetcher = new NativeDataFetcher();

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200));

      const response = await fetcher.fetch('http://test.com/api');
      expect(response.status).to.equal(200);
      expect(fetchInput).to.equal('http://test.com/api');
      expect(fetchInit?.method).to.equal('GET');
      expect(fetchInit?.body).to.be.undefined;

      fetchStub.restore();
    });

    it('should add headers dynamically and validate them', async () => {
      const fetcher = new NativeDataFetcher();

      const fetchStub = sinon
        .stub(global, 'fetch')
        .callsFake(mockFetch(200, {}, { customHeaders: { 'X-Test-Header': 'InitialValue' } }));

      const response = await fetcher.fetch('http://test.com/api');

      const headers = response.headers as unknown as {
        get: (name: string) => string;
        set: (name: string, value: string) => void;
      };

      expect(headers.get('X-Test-Header')).to.equal('InitialValue');

      fetchStub.restore();
    });

    it('should execute request with text response type', async () => {
      const fetcher = new NativeDataFetcher();

      const fetchStub = sinon
        .stub(global, 'fetch')
        .callsFake(mockFetch(200, {}, { responseType: 'text' }));

      const response = await fetcher.fetch('http://test.com/api');
      expect(response.status).to.equal(200);
      expect(fetchInput).to.equal('http://test.com/api');
      expect(fetchInit?.method).to.equal('GET');
      expect(fetchInit?.body).to.be.undefined;

      fetchStub.restore();
    });

    it('should execute POST request with data', async () => {
      const fetcher = new NativeDataFetcher();
      const postData = { x: 'val1', y: 'val2' };
      const respData = { z: 'val3' };

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200, respData));

      const response = await fetcher.post('http://test.com/api', postData);
      expect(response.status).to.equal(200);
      expect(response.data).to.equal(respData);
      expect(fetchInput).to.equal('http://test.com/api');
      expect(fetchInit?.method).to.equal('POST');
      expect(fetchInit?.body).to.equal(JSON.stringify(postData));

      fetchStub.restore();
    });

    it('should execute GET request without data', async () => {
      const fetcher = new NativeDataFetcher();
      const respData = { z: 'val3' };

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200, respData));

      const response = await fetcher.get('http://test.com/api');
      expect(response.status).to.equal(200);
      expect(response.data).to.equal(respData);
      expect(fetchInput).to.equal('http://test.com/api');
      expect(fetchInit?.method).to.equal('GET');
      expect(fetchInit?.body).to.be.undefined;

      fetchStub.restore();
    });

    it('should execute DELETE request without data', async () => {
      const fetcher = new NativeDataFetcher();
      const respData = { z: 'val3' };

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200, respData));

      const response = await fetcher.delete('http://test.com/api');
      expect(response.status).to.equal(200);
      expect(response.data).to.equal(respData);
      expect(fetchInput).to.equal('http://test.com/api');
      expect(fetchInit?.method).to.equal('DELETE');
      expect(fetchInit?.body).to.be.undefined;

      fetchStub.restore();
    });

    it('should execute PUT request with data', async () => {
      const fetcher = new NativeDataFetcher();
      const putData = { x: 'val1', y: 'val2' };
      const respData = { z: 'val3' };

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200, respData));

      const response = await fetcher.put('http://test.com/api', putData);
      expect(response.status).to.equal(200);
      expect(response.data).to.equal(respData);
      expect(fetchInput).to.equal('http://test.com/api');
      expect(fetchInit?.method).to.equal('PUT');
      expect(fetchInit?.body).to.equal(JSON.stringify(putData));

      fetchStub.restore();
    });

    it('should execute HEAD request without data', async () => {
      const fetcher = new NativeDataFetcher();
      const respData = { z: 'val3' };

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200, respData));

      const response = await fetcher.head('http://test.com/api');
      expect(response.status).to.equal(200);
      expect(response.data).to.equal(respData);
      expect(fetchInput).to.equal('http://test.com/api');
      expect(fetchInit?.method).to.equal('HEAD');
      expect(fetchInit?.body).to.be.undefined;

      fetchStub.restore();
    });

    it('should execute failed request with data', async () => {
      const fetcher = new NativeDataFetcher();

      const fetchStub = sinon
        .stub(global, 'fetch')
        .callsFake(mockFetch(400, { status: 400, statusText: 'Error', data: { test: 'test?' } }));

      await fetcher.fetch('http://test.com/api').catch((error) => {
        expect(error.response.status).to.equal(400);
        expect(error.response.data.data).to.deep.equal({ test: 'test?' });
      });

      fetchStub.restore();
    });

    it('should execute request with custom init', async () => {
      const headers = {
        x: 'x',
        y: 'y',
      };
      const fetcher = new NativeDataFetcher({
        credentials: 'same-origin',
        referrer: 'foo',
        headers,
      });

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200));

      const response = await fetcher.fetch('http://test.com/api');
      expect(response.status).to.equal(200);
      expect(fetchInit?.credentials).to.equal('same-origin');
      expect(fetchInit?.referrer).to.equal('foo');
      expect(global.Headers).to.have.been.calledOnce;
      expect(global.Headers).to.have.been.calledWith(headers);

      fetchStub.restore();
    });

    it('should debug log request and response', async () => {
      const fetcher = new NativeDataFetcher();

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200));

      await fetcher.fetch('http://test.com/api');
      expect(debug.http.log).to.have.been.calledTwice;

      fetchStub.restore();
    });

    it('should debug log request and response error', async () => {
      const fetcher = new NativeDataFetcher();

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(400));

      await fetcher.fetch('http://test.com/api').catch(() => {
        expect(debug.http.log).to.have.been.calledThrice;
      });

      fetchStub.restore();
    });

    it('should use debugger override', async () => {
      const fetcher = new NativeDataFetcher({ debugger: debug.personalize });

      const fetchStub = sinon.stub(global, 'fetch').callsFake(mockFetch(200));

      await fetcher.fetch('http://test.com/api');
      expect(debug.personalize.log).to.have.been.calledTwice;

      fetchStub.restore();
    });

    it('should use fetch override', async () => {
      const fetchOverride = sinon.spy(mockFetch(200));
      const fetcher = new NativeDataFetcher({ fetch: fetchOverride });

      await fetcher.fetch('http://test.com/api');
      expect(fetchOverride).to.be.called;
    });

    it('should handle response.json() error', async () => {
      const fetcher = new NativeDataFetcher();

      sinon.stub(global, 'fetch').callsFake(mockFetch(200, {}, { jsonError: 'ERROR' }));

      const response = await fetcher.fetch('http://test.com/api');
      expect(response.status).to.equal(200);
      expect(response.data).to.be.undefined;
      expect(debug.http.log).to.have.been.calledThrice;
    });

    it('should handle response.text() error', async () => {
      const fetcher = new NativeDataFetcher();

      sinon.stub(global, 'fetch').callsFake(mockFetch(200, {}, { jsonError: 'ERROR' }));

      const response = await fetcher.fetch('http://test.com/api');
      expect(response.status).to.equal(200);
      expect(response.data).to.be.undefined;
      expect(debug.http.log).to.have.been.calledThrice;
    });

    it('should return error upon request timeout', async () => {
      const fetcher = new NativeDataFetcher({ timeout: 10 });

      sinon.stub(global, 'fetch').callsFake(mockFetch(200));

      await fetcher.fetch('http://test.com/api').catch((error) => {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('HTTP 408 ERROR');
      });
    });
  });
});
