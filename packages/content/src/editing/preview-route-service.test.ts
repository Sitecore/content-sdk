/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import { GraphQLRequestClient } from '@sitecore-content-sdk/core';
import { PreviewRouteService, previewRouteQuery } from './preview-route-service';
import { LayoutKind } from './models';
import { LayoutServicePageState } from '../layout';

describe('PreviewRouteService', () => {
  const hostname = 'http://site';
  const clientFactory = GraphQLRequestClient.createClientFactory({
    endpoint: hostname,
    contextId: 'test-context-id',
  });

  const service = new PreviewRouteService({ clientFactory });

  const baseOptions = {
    site: 'default-site',
    routePath: '/about',
    language: 'en',
    mode: LayoutServicePageState.Preview,
  };

  afterEach(() => {
    nock.cleanAll();
    sinon.restore();
  });

  it('should resolve the item id for a route', async () => {
    nock(hostname)
      .post('/', (body) => body.query === previewRouteQuery)
      .reply(200, {
        data: { layout: { item: { id: 'about-item-id' } } },
      });

    const result = await service.resolveItemId(baseOptions);

    expect(result).to.equal('about-item-id');
  });

  it('should send the route and site as query variables', async () => {
    let capturedVariables: Record<string, unknown> = {};

    nock(hostname)
      .post('/', (body) => {
        capturedVariables = body.variables;
        return true;
      })
      .reply(200, { data: { layout: { item: { id: 'about-item-id' } } } });

    await service.resolveItemId(baseOptions);

    expect(capturedVariables).to.deep.equal({
      site: 'default-site',
      routePath: '/about',
      language: 'en',
    });
  });

  it('should send the preview headers so unpublished routes resolve', async () => {
    nock(hostname, {
      reqheaders: {
        sc_previewMode: 'true',
        sc_editMode: 'false',
        sc_layoutKind: 'shared',
        sc_site: 'default-site',
        sc_previewTime: '2026-08-20T14:00:00Z',
      },
    })
      .post('/')
      .reply(200, { data: { layout: { item: { id: 'about-item-id' } } } });

    const result = await service.resolveItemId({
      ...baseOptions,
      layoutKind: LayoutKind.Shared,
      previewTime: '2026-08-20T14:00:00Z',
    });

    expect(result).to.equal('about-item-id');
  });

  it('should request the default variant, since variants are scoped to a route', async () => {
    nock(hostname, { reqheaders: { sc_variant: 'default' } })
      .post('/')
      .reply(200, { data: { layout: { item: { id: 'about-item-id' } } } });

    const result = await service.resolveItemId(baseOptions);

    expect(result).to.equal('about-item-id');
  });

  it('should return null when the route has no item', async () => {
    nock(hostname).post('/').reply(200, { data: { layout: { item: null } } });

    const result = await service.resolveItemId(baseOptions);

    expect(result).to.be.null;
  });

  it('should return null when the route is not found', async () => {
    nock(hostname).post('/').reply(200, { data: { layout: null } });

    const result = await service.resolveItemId(baseOptions);

    expect(result).to.be.null;
  });

  it('should throw an error when language is not provided', async () => {
    await service
      .resolveItemId({ ...baseOptions, language: '' })
      .then(() => {
        expect.fail('should have thrown');
      })
      .catch((error) => {
        expect(error.message).to.equal('The language must be a non-empty string');
      });
  });

  it('should throw an error when client factory is not provided', () => {
    expect(() => new PreviewRouteService({ clientFactory: undefined as never })).to.throw(
      'clientFactory needs to be provided when initializing GraphQL client.'
    );
  });
});
