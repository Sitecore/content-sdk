import { setWebPersonalizationGlobal } from './set-web-personalization-global';
import * as getProfileIdModule from '../initialization/get-profile-id';
import * as analyticsInternalModule from '@sitecore-content-sdk/analytics-core/internal';
import { PACKAGE_VERSION } from '../consts';
import { WebPersonalizationOptions } from '../initialization/types';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  getAnalyticsPlugin: jest.fn(),
}));

jest.mock('../initialization/get-profile-id', () => ({
  getProfileId: jest.fn(),
}));

describe('setWebPersonalizationGlobal', () => {
  const coreConfig = {
    siteName: 'test-site',
    contextId: 'test-context-id',
    edgeUrl: 'https://edge.test.com',
  };

  const webPersonalization: WebPersonalizationOptions = {
    async: true,
    defer: false,
    language: 'en-us',
  };

  const mockGetClientId = jest.fn() as jest.Mock<() => string | null>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetClientId.mockReturnValue('client-id-123');
    (analyticsInternalModule.getAnalyticsPlugin as jest.Mock).mockReturnValue({
      adapter: { getClientId: mockGetClientId },
    });
    if (typeof window !== 'undefined') {
      delete (window as any).scCloudSDK;
    }
  });

  it('should not throw or set the global when window is undefined', () => {
    const originalWindow = global.window;
    // @ts-expect-error - simulating SSR environment
    delete global.window;

    expect(() => setWebPersonalizationGlobal(coreConfig, webPersonalization)).not.toThrow();

    global.window = originalWindow;
  });

  it('should expose personalize.settings so the CDN bootstrap does not throw', () => {
    setWebPersonalizationGlobal(coreConfig, webPersonalization);

    const sdk = (window as any).scCloudSDK;
    expect(sdk).toBeDefined();
    expect(sdk.personalize.settings).toEqual(webPersonalization);
    expect(sdk.personalize.version).toBe(PACKAGE_VERSION);
  });

  it('should copy the web personalization options onto personalize.settings', () => {
    setWebPersonalizationGlobal(coreConfig, webPersonalization);

    const sdk = (window as any).scCloudSDK;
    // A copy, not the same reference, so the library writing guestId/params onto settings does not
    // leak onto the options exposed on window.scContentSDK.personalize.options.
    expect(sdk.personalize.settings).not.toBe(webPersonalization);
    expect(sdk.personalize.settings).toEqual(webPersonalization);
  });

  it('should populate core.settings from the core config', () => {
    setWebPersonalizationGlobal(coreConfig, webPersonalization);

    const sdk = (window as any).scCloudSDK;
    expect(sdk.core.settings).toEqual({
      siteName: 'test-site',
      sitecoreEdgeContextId: 'test-context-id',
      sitecoreEdgeUrl: 'https://edge.test.com',
    });
    expect(sdk.core.version).toBe(PACKAGE_VERSION);
  });

  it('should wire core.getBrowserId to the analytics client id', () => {
    setWebPersonalizationGlobal(coreConfig, webPersonalization);

    const sdk = (window as any).scCloudSDK;
    expect(sdk.core.getBrowserId()).toBe('client-id-123');
    expect(mockGetClientId).toHaveBeenCalled();
  });

  it('should return an empty string from core.getBrowserId when the client id is missing', () => {
    mockGetClientId.mockReturnValue(null);

    setWebPersonalizationGlobal(coreConfig, webPersonalization);

    const sdk = (window as any).scCloudSDK;
    expect(sdk.core.getBrowserId()).toBe('');
  });

  it('should wire core.getGuestId to getProfileId', async () => {
    (
      getProfileIdModule.getProfileId as jest.Mock<typeof getProfileIdModule.getProfileId>
    ).mockResolvedValue('guest-ref-789');

    setWebPersonalizationGlobal(coreConfig, webPersonalization);

    const sdk = (window as any).scCloudSDK;
    await expect(sdk.core.getGuestId()).resolves.toBe('guest-ref-789');
  });

  it('should preserve a global already registered by another script', () => {
    const existingGetGuestId = jest.fn();
    const existingGetBrowserId = jest.fn();
    (window as any).scCloudSDK = {
      core: {
        getGuestId: existingGetGuestId,
        getBrowserId: existingGetBrowserId,
        settings: {
          siteName: 'existing-site',
          sitecoreEdgeContextId: 'existing-ctx',
          sitecoreEdgeUrl: 'https://existing.edge',
        },
        version: '9.9.9',
      },
      personalize: {
        settings: { async: false, defer: true },
        version: '9.9.9',
      },
    };

    setWebPersonalizationGlobal(coreConfig, webPersonalization);

    const sdk = (window as any).scCloudSDK;
    // An already-registered runtime is authoritative and must be preserved.
    expect(sdk.core.getGuestId).toBe(existingGetGuestId);
    expect(sdk.core.getBrowserId).toBe(existingGetBrowserId);
    expect(sdk.core.version).toBe('9.9.9');
    expect(sdk.core.settings.siteName).toBe('existing-site');
    expect(sdk.personalize.version).toBe('9.9.9');
  });
});
