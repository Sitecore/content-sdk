/**
 * @jest-environment jsdom
 */
import { personalize } from './personalize';
import { Personalizer } from './personalizer';
import type { PersonalizeData } from './personalizer';

// Mock the core module
jest.mock('@sitecore-content-sdk/core', () => ({
  getInitState: jest.fn(),
  getGroupSettings: jest.fn(),
  getPlugin: jest.fn(),
}));

// Mock utils
jest.mock('@sitecore-content-sdk/utils', () => ({
  getCookieValueClientSide: jest.fn(),
}));

// Mock the Personalizer
jest.mock('./personalizer');

import { getInitState, getGroupSettings, getPlugin } from '@sitecore-content-sdk/core';
import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';

const mockGetInitState = getInitState as jest.MockedFunction<typeof getInitState>;
const mockGetGroupSettings = getGroupSettings as jest.MockedFunction<typeof getGroupSettings>;
const mockGetPlugin = getPlugin as jest.MockedFunction<typeof getPlugin>;
const mockGetCookieValueClientSide = getCookieValueClientSide as jest.MockedFunction<
  typeof getCookieValueClientSide
>;

describe('personalize', () => {
  const personalizeData: PersonalizeData = {
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN',
  };

  const mockConfig = {
    sitecoreContextId: 'test-context-id',
    sitecoreEdgeUrl: 'https://edge.example.com',
  };

  const mockEnvironment = {
    getCookie: jest.fn(),
    setCookie: jest.fn(),
  };

  const getInteractiveExperienceDataSpy = jest.spyOn(
    Personalizer.prototype,
    'getInteractiveExperienceData'
  );

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockGetInitState.mockReturnValue({
      config: mockConfig,
      environment: mockEnvironment,
      initialized: true,
      plugins: [],
      pluginSettings: {},
      groups: {},
      groupSettings: {},
    } as any);

    mockGetGroupSettings.mockReturnValue({
      browserIdCookieName: 'bid_test',
      browserIdCookieMaxAge: 31536000,
    });

    mockGetPlugin.mockReturnValue({
      name: '@sitecore-content-sdk/personalize',
      settings: {
        guestIdCookieName: 'gid_test',
      },
    });

    mockGetCookieValueClientSide.mockImplementation((name: string) => {
      if (name === 'bid_test') return 'browser-id-123';
      if (name === 'gid_test') return 'guest-id-456';
      return '';
    });

    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ ref: 'ref' }),
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { search: '?utm_source=test' },
      writable: true,
    });
  });

  it('should be a function', () => {
    expect(typeof personalize).toBe('function');
  });

  it('should call Personalizer with browser ID and guest ID from cookies', async () => {
    await personalize(personalizeData);

    expect(Personalizer).toHaveBeenCalledWith('browser-id-123', 'guest-id-456');
  });

  it('should get browser ID cookie name from tracking group settings', async () => {
    await personalize(personalizeData);

    expect(mockGetGroupSettings).toHaveBeenCalledWith('tracking');
    expect(mockGetCookieValueClientSide).toHaveBeenCalledWith('bid_test');
  });

  it('should get guest ID cookie name from personalize plugin settings', async () => {
    await personalize(personalizeData);

    expect(mockGetPlugin).toHaveBeenCalledWith('@sitecore-content-sdk/personalize');
    expect(mockGetCookieValueClientSide).toHaveBeenCalledWith('gid_test');
  });

  it('should build settings with config values', async () => {
    await personalize(personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      personalizeData,
      expect.objectContaining({
        sitecoreEdgeContextId: 'test-context-id',
        sitecoreEdgeUrl: 'https://edge.example.com',
        siteName: '',
      }),
      expect.any(String),
      expect.any(Object)
    );
  });

  it('should use default Edge URL if not provided', async () => {
    mockGetInitState.mockReturnValue({
      config: {
        sitecoreContextId: 'test-context-id',
        sitecoreEdgeUrl: undefined,
      },
      environment: mockEnvironment,
      initialized: true,
      plugins: [],
      pluginSettings: {},
      groups: {},
      groupSettings: {},
    } as any);

    await personalize(personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      personalizeData,
      expect.objectContaining({
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
      }),
      expect.any(String),
      expect.any(Object)
    );
  });

  it('should pass window.location.search to Personalizer', async () => {
    await personalize(personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      personalizeData,
      expect.any(Object),
      '?utm_source=test',
      expect.any(Object)
    );
  });

  it('should pass timeout option', async () => {
    await personalize(personalizeData, { timeout: 5000 });

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      personalizeData,
      expect.any(Object),
      expect.any(String),
      expect.objectContaining({
        timeout: 5000,
      })
    );
  });

  it('should handle missing browser ID cookie name gracefully', async () => {
    mockGetGroupSettings.mockReturnValue(undefined);
    mockGetCookieValueClientSide.mockImplementation(() => '');

    await personalize(personalizeData);

    expect(Personalizer).toHaveBeenCalledWith('', '');
  });

  it('should handle missing guest ID cookie name gracefully', async () => {
    mockGetPlugin.mockReturnValue(undefined);

    await personalize(personalizeData);

    expect(Personalizer).toHaveBeenCalledWith('browser-id-123', undefined);
  });
});

