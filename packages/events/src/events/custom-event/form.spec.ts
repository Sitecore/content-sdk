import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as core from '@sitecore-content-sdk/core';
import { PACKAGE_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import * as eventsPluginModule from '../../initialization/plugin';
import { form } from './form';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal');
jest.mock('../../initialization/plugin');
jest.mock('../../debug', () => {
  const initialModule: object = jest.requireActual('../../debug');
  return {
    ...initialModule,
    debug: {
      events: jest.fn(),
    },
  };
});

describe('form event', () => {
  const mockAdapter = {
    getClientId: jest.fn(),
  };

  const mockAnalyticsPlugin = {
    options: {
      cookies: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { clientId: 'cid_name' },
        path: '/',
      },
    },
    adapter: mockAdapter,
  };

  const mockCoreContext = {
    config: {
      contextId: '123',
      edgeUrl: 'https://edge-platform.sitecorecloud.io',
      siteName: '456',
    },
    readyPromise: Promise.resolve(),
  };

  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(core, 'getCoreContext').mockReturnValue(mockCoreContext as any);
    jest
      .spyOn(analyticsPluginsModule, 'getAnalyticsPlugin')
      .mockReturnValue(mockAnalyticsPlugin as any);
    jest.spyOn(eventsPluginModule, 'getEventsPlugin').mockReturnValue({} as any);
  });

  it('should send the form event without EP optional attributes', async () => {
    const fetchSpy = jest.spyOn(core.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
      data: { ref: 'ref' } as EPResponse,
    } as core.NativeDataFetcherResponse<unknown>);

    mockAdapter.getClientId.mockReturnValue('test_id');

    const expectedBody = JSON.stringify({
      type: 'FORM',
      ext: { componentInstanceId: 'test', formId: '1234', interactionType: 'SUBMITTED' },
      browser_id: 'test_id',
      client_key: '',
      pos: '',
      requested_at: '2024-01-01T00:00:00.000Z',
    });

    await form('1234', 'SUBMITTED', 'test');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenLastCalledWith(
      'https://edge-platform.sitecorecloud.io/v1/events/v1.2/events?siteId=456',
      {
        body: expectedBody,
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
          'X-Library-Version': PACKAGE_VERSION,
          'x-sitecore-contextid': '123',
        },
        method: 'POST',
      }
    );
  });

  it('should use empty string for id when getClientId returns null', async () => {
    const fetchSpy = jest.spyOn(core.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
      data: { ref: 'ref' } as EPResponse,
    } as core.NativeDataFetcherResponse<unknown>);

    mockAdapter.getClientId.mockReturnValue(null);

    await form('1234', 'VIEWED', 'test');

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"browser_id":""'),
      })
    );
  });

  it('should wait for core context ready promise', async () => {
    let resolveReady: () => void;
    const readyPromise = new Promise<void>((resolve) => {
      resolveReady = resolve;
    });

    jest.spyOn(core, 'getCoreContext').mockReturnValue({
      ...mockCoreContext,
      readyPromise,
    } as any);

    mockAdapter.getClientId.mockReturnValue('test_id');

    const fetchSpy = jest.spyOn(core.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
      data: { ref: 'ref' } as EPResponse,
    } as core.NativeDataFetcherResponse<unknown>);

    const formPromise = form('1234', 'SUBMITTED', 'test');

    expect(fetchSpy).not.toHaveBeenCalled();

    resolveReady!();
    await formPromise;

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should call getEventsPlugin to ensure plugin is initialized', async () => {
    jest.spyOn(core.NativeDataFetcher.prototype, 'fetch').mockResolvedValue({
      data: { ref: 'ref' } as EPResponse,
    } as core.NativeDataFetcherResponse<unknown>);

    mockAdapter.getClientId.mockReturnValue('test_id');

    await form('1234', 'SUBMITTED', 'test');

    expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
  });
});
