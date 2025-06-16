import { expect } from 'chai';
import sinon from 'sinon';
import { sendPostRequest } from './fetcher'; // adjust path accordingly

describe('sendPostRequest', () => {
  let fetchStub: sinon.SinonStub;

  const testUrl = 'https://example.com/token';
  const params = new URLSearchParams({ grant_type: 'client_credentials' });

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return data on successful response', async () => {
    const mockData = { access_token: 'abc123', expires_in: 3600 };

    fetchStub.resolves({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await sendPostRequest<typeof mockData>(testUrl, params);

    expect(
      fetchStub.calledOnceWithExactly(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
    ).to.be.true;

    expect(result).to.deep.equal(mockData);
  });

  it('should throw error with error_description from response', async () => {
    const errorResponse = { error_description: 'Invalid client credentials' };

    fetchStub.resolves({
      ok: false,
      json: async () => errorResponse,
    } as Response);

    try {
      await sendPostRequest(testUrl, params);
      expect.fail('Expected to throw');
    } catch (err) {
      expect((err as Error).message).to.equal('Invalid client credentials');
    }
  });

  it('should throw error with error field if error_description is missing', async () => {
    const errorResponse = { error: 'invalid_request' };

    fetchStub.resolves({
      ok: false,
      json: async () => errorResponse,
    } as Response);

    try {
      await sendPostRequest(testUrl, params);
      expect.fail('Expected to throw');
    } catch (err) {
      expect((err as Error).message).to.equal('invalid_request');
    }
  });

  it('should throw generic error if neither error nor error_description is present', async () => {
    const errorResponse = { message: 'unexpected failure' };

    fetchStub.resolves({
      ok: false,
      json: async () => errorResponse,
    } as Response);

    try {
      await sendPostRequest(testUrl, params);
      expect.fail('Expected to throw');
    } catch (err) {
      expect((err as Error).message).to.equal('Unknown error occurred');
    }
  });

  it('should return error response without throwing when throwOnError is false', async () => {
    const errorResponse = { error: 'authorization_pending' };

    fetchStub.resolves({
      ok: false,
      json: async () => errorResponse,
    } as Response);

    const result = await sendPostRequest<typeof errorResponse>(testUrl, params, false);

    expect(result).to.deep.equal(errorResponse);
  });
});
