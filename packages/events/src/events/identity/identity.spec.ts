import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as eventsPluginModule from '../../initialization/plugin';
import * as sendEventModule from '../send-event/sendEvent';
import { identity } from './identity';
import { IdentityEvent } from './identity-event';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal');
jest.mock('@sitecore-content-sdk/core');
jest.mock('../../initialization/plugin');
jest.mock('./identity-event', () => {
  return {
    IdentityEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse')),
      };
    }),
  };
});

const id = 'test_id';
const identityData = {
  channel: 'WEB',
  currency: 'EUR',
  identifiers: [
    {
      expiryDate: undefined,
      id,
      provider: 'email',
    },
  ],
  language: 'EN',
  page: 'identity',
};

const extensionData = { extKey: 'extValue' };

describe('identity', () => {
  const mockAdapter = {
    getClientId: jest.fn(),
  };

  const mockAnalyticsPlugin = {
    settings: {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { clientId: 'cid_name' },
        path: '/',
      },
    },
    adapter: mockAdapter,
  };

  const mockCoreContext = {
    settings: {
      contextId: '123',
      edgeUrl: 'https://edge.test.com',
      siteName: '456',
    },
    readyPromise: Promise.resolve(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(coreModule, 'getCoreContext').mockReturnValue(mockCoreContext as any);
    jest
      .spyOn(analyticsPluginsModule, 'getAnalyticsPlugin')
      .mockReturnValue(mockAnalyticsPlugin as any);
    jest.spyOn(eventsPluginModule, 'getEventsPlugin').mockReturnValue({} as any);
  });

  it('should send an IdentityEvent to the server', async () => {
    mockAdapter.getClientId.mockReturnValue(id);

    const response = await identity({ ...identityData, extensionData });

    expect(IdentityEvent).toHaveBeenCalledWith({
      id,
      identityData: { ...identityData, extensionData },
      sendEvent: sendEventModule.sendEvent,
      settings: { ...mockCoreContext.settings, ...mockAnalyticsPlugin.settings },
    });
    expect(response).toBe('mockedResponse');
  });

  it('should use empty string for id when getClientId returns null', async () => {
    mockAdapter.getClientId.mockReturnValue(null);

    await identity({ ...identityData, extensionData });

    expect(IdentityEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '',
      })
    );
  });

  it('should wait for core settings ready promise', async () => {
    let resolveReady: () => void;
    const readyPromise = new Promise<void>((resolve) => {
      resolveReady = resolve;
    });

    jest.spyOn(coreModule, 'getCoreContext').mockReturnValue({
      ...mockCoreContext,
      readyPromise,
    } as any);

    mockAdapter.getClientId.mockReturnValue(id);

    const identityPromise = identity({ ...identityData, extensionData });

    expect(IdentityEvent).not.toHaveBeenCalled();

    resolveReady!();
    await identityPromise;

    expect(IdentityEvent).toHaveBeenCalledTimes(1);
  });

  it('should call getEventsPlugin to ensure plugin is initialized', async () => {
    mockAdapter.getClientId.mockReturnValue(id);

    await identity({ ...identityData, extensionData });

    expect(eventsPluginModule.getEventsPlugin).toHaveBeenCalledTimes(1);
  });
});
