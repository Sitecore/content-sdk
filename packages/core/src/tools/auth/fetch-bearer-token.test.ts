import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import nock from 'nock';
import { fetchBearerToken } from './fetch-bearer-token';

describe('fetchBearerToken', () => {
  const clientId = 'test-client-id';
  const clientSecret = 'test-client-secret';

  afterEach(() => {
    sinon.restore();
    nock.cleanAll();
  });

  it('should send POST request to SITECORE_AUTH_ENDPOINT url', async () => {
    nock('https://auth.sitecorecloud.io')
      .post('/oauth/token')
      .reply(200, {
        token_type: 'Bearer',
        access_token: 'correct-token',
        expires_in: 3600,
        refresh_token: '******',
        scope: '*******',
      });

    nock('https://auth.sitecorecloud.io')
      .intercept('/.*/', '*')
      .reply(200, {
        token_type: 'Bearer',
        access_token: 'incorrect-token',
        expires_in: 3600,
        refresh_token: '******',
        scope: '*******',
      });

    const token = await fetchBearerToken({
      clientId,
      clientSecret,
    });

    expect(token).to.equal('correct-token');
  });

  it('should send POST request to custom endpoint url with custom audience', async () => {
    const audience = 'test-audience';
    const endpoint = 'https://custom-endpoint.sitecorecloud.io/oauth/token';
    nock('https://custom-endpoint.sitecorecloud.io')
      .post('/oauth/token', (body) => body.audience === audience)
      .reply(200, {
        token_type: 'Bearer',
        access_token: 'correct-token',
        expires_in: 3600,
        refresh_token: '******',
        scope: '*******',
      });

    nock('https://auth.sitecorecloud.io')
      .intercept('/.*/', '*')
      .reply(200, {
        token_type: 'Bearer',
        access_token: 'incorrect-token',
        expires_in: 3600,
        refresh_token: '******',
        scope: '*******',
      });

    const token = await fetchBearerToken({
      clientId,
      clientSecret,
      audience,
      endpoint,
    });

    expect(token).to.equal('correct-token');
  });

  it('should log when request to SITECORE_AUTH_ENDPOINT fails', async () => {
    nock('https://auth.sitecorecloud.io')
      .post('/oauth/token')
      .reply(503, 'Service Unavailable');
    const consoleErrorStub = sinon.stub(console, 'error');
    const token = await fetchBearerToken({
      clientId,
      clientSecret,
    });

    expect(token).to.be.null;
    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red(
        // eslint-disable-next-line
        `Error authenticating with M2M token endpoint: SyntaxError: Unexpected token 'S', "Service Unavailable" is not valid JSON`
      )
    );
  });
});
