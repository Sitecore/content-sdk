import * as internal from '@sitecore-content-sdk/__core__/internal';
import { PackageInitializer } from '@sitecore-content-sdk/__core__/internal';
import * as utilsModule from '@sitecore-content-sdk/utils';
import { ErrorMessages, PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from '../../consts';
import * as getCdnUrl from '../../web-personalization/get-cdn-url';
import * as createPersonalizeCookieModule from './createPersonalizeCookie';
import { addPersonalize, awaitInit, sideEffects } from './initializer';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/utils', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/utils');

  return {
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-content-sdk/__core__/internal', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/__core__/internal');

  return {
    __esModule: true,
    ...originalModule,

    PackageInitializer: jest.fn(),
    debug: jest.fn(() => jest.fn()),
  };
});

describe('sideEffects', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const debugMock = internal.debug as jest.MockedFunction<typeof internal.debug>;

  // eslint-disable-next-line max-len
  it('should call createPersonalizeCookie when both enableBrowserCookie and enablePersonalizeCookie are true', async () => {
    jest.spyOn(internal, 'getCloudSDKSettingsBrowser').mockImplementation(() => {
      return { cookieSettings: { enableBrowserCookie: true, name: { browserId: 'bid' } } } as any;
    });
    jest.spyOn(internal, 'getEnabledPackageBrowser').mockReturnValue({
      settings: {
        enablePersonalizeCookie: true,
      },
    } as any);

    const createPersonalizeCookieSpy = jest
      .spyOn(createPersonalizeCookieModule, 'createPersonalizeCookie')
      .mockImplementation(jest.fn() as any);

    await sideEffects();
    expect(createPersonalizeCookieSpy).toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it('should NOT call createPersonalizeCookie when either enableBrowserCookie or enablePersonalizeCookie is false', async () => {
    jest.spyOn(internal, 'getCloudSDKSettingsBrowser').mockImplementation(() => {
      return { cookieSettings: { enableBrowserCookie: false, name: { browserId: 'bid' } } } as any;
    });
    jest.spyOn(internal, 'getEnabledPackageBrowser').mockReturnValue({
      settings: {
        enablePersonalizeCookie: true,
      },
    } as any);

    const createPersonalizeCookieSpy = jest
      .spyOn(createPersonalizeCookieModule, 'createPersonalizeCookie')
      .mockImplementation(jest.fn() as any);

    await sideEffects();
    expect(createPersonalizeCookieSpy).not.toHaveBeenCalled();
  });

  it('should add the library properties to window.scCloudSDK object and inject the script', async () => {
    jest.spyOn(getCdnUrl, 'getCdnUrl').mockResolvedValueOnce('https://test');
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue('test');
    jest.spyOn(internal, 'getCloudSDKSettingsBrowser').mockImplementation(() => {
      return { cookieSettings: { name: { browserId: 'bid' } } } as any;
    });
    jest.spyOn(internal, 'getEnabledPackageBrowser').mockReturnValue({
      settings: {
        webPersonalization: { async: true, defer: false, language: 'en' },
      },
    } as any);

    const appendScriptWithAttributesMock = jest.spyOn(utilsModule, 'appendScriptWithAttributes');

    global.window.scCloudSDK = undefined as any;
    expect(global.window.scCloudSDK).toBeUndefined();
    await sideEffects();
    expect(global.window.scCloudSDK.personalize).toBeDefined();
    expect(global.window.scCloudSDK.personalize.version).toEqual(PACKAGE_VERSION);
    expect(global.window.scCloudSDK.personalize.settings).toEqual({
      async: true,
      defer: false,
      language: 'en',
    });
    expect(global.window.scCloudSDK.personalize.personalize).toBeDefined();
    expect(appendScriptWithAttributesMock).toHaveBeenCalledWith({
      async: true,
      src: 'https://test',
    });
    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect((debugMock as any).mock.results[0].value.mock.calls[0][0]).toBe(
      'personalizeClient library initialized'
    );
  });

  // eslint-disable-next-line max-len
  it('should add the library properties to window.scCloudSDK object and inject the script without language', async () => {
    jest.spyOn(getCdnUrl, 'getCdnUrl').mockResolvedValueOnce('https://test');
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue('test');
    jest.spyOn(internal, 'getCloudSDKSettingsBrowser').mockImplementation(() => {
      return { cookieSettings: { name: { browserId: 'bid' } } } as any;
    });
    jest.spyOn(internal, 'getEnabledPackageBrowser').mockReturnValue({
      settings: {
        webPersonalization: { async: true, defer: false },
      },
    } as any);

    const appendScriptWithAttributesMock = jest.spyOn(utilsModule, 'appendScriptWithAttributes');

    global.window.scCloudSDK = undefined as any;
    expect(global.window.scCloudSDK).toBeUndefined();
    await sideEffects();
    expect(global.window.scCloudSDK.personalize).toBeDefined();
    expect(global.window.scCloudSDK.personalize.version).toEqual(PACKAGE_VERSION);
    expect(global.window.scCloudSDK.personalize.settings).toEqual({ async: true, defer: false });
    expect(global.window.scCloudSDK.personalize.personalize).toBeDefined();
    expect(appendScriptWithAttributesMock).toHaveBeenCalledWith({
      async: true,
      src: 'https://test',
    });
    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect((debugMock as any).mock.results[0].value.mock.calls[0][0]).toBe(
      'personalizeClient library initialized'
    );
  });

  it('should not inject the script if the getCdnUrl returns null', async () => {
    jest.spyOn(getCdnUrl, 'getCdnUrl').mockResolvedValueOnce(null);
    jest.spyOn(internal, 'getEnabledPackageBrowser').mockReturnValue({
      settings: {
        webPersonalization: { async: true, defer: false },
      },
    } as any);

    const appendScriptWithAttributesMock = jest.spyOn(utilsModule, 'appendScriptWithAttributes');

    await sideEffects();
    expect(appendScriptWithAttributesMock).not.toHaveBeenCalled();
  });
  it('should not add the settings properties to window.scCloudSDK object and not inject the script', async () => {
    jest.spyOn(getCdnUrl, 'getCdnUrl').mockResolvedValueOnce(null);
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue('test');
    jest.spyOn(internal, 'getCloudSDKSettingsBrowser').mockImplementation(() => {
      return { cookieSettings: { name: { browserId: 'bid' } } } as any;
    });
    jest.spyOn(internal, 'getEnabledPackageBrowser').mockReturnValue({
      settings: {
        webPersonalization: false,
      },
    } as any);
    const appendScriptWithAttributesMock = jest.spyOn(utilsModule, 'appendScriptWithAttributes');

    global.window.scCloudSDK = undefined as any;
    expect(global.window.scCloudSDK).toBeUndefined();
    await sideEffects();
    expect(global.window.scCloudSDK.personalize).toBeDefined();
    expect(global.window.scCloudSDK.personalize.version).toEqual(PACKAGE_VERSION);
    expect(global.window.scCloudSDK.personalize.settings).toBeUndefined();
    expect(appendScriptWithAttributesMock).not.toHaveBeenCalled();
    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect((debugMock as any).mock.results[0].value.mock.calls[0][0]).toBe(
      'personalizeClient library initialized'
    );
  });
});

describe('addPersonalize', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should run the addPersonalize function', async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any);

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [],
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        enablePersonalizeCookie: false,
        webPersonalization: false,
      },
      sideEffects,
    });
    expect(result).toEqual(fakeThis);
  });

  it(`should run the addPersonalize function and set webPersonalization to false if false is provided 
    along with enablePersonalizeCookie set to false if provided`, async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, {
      enablePersonalizeCookie: false,
      webPersonalization: false,
    });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [],
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        enablePersonalizeCookie: false,
        webPersonalization: false,
      },
      sideEffects,
    });
    expect(result).toEqual(fakeThis);
  });

  it(`should run the addPersonalize function and use default values for web personalize when true 
    along with enablePersonalizeCookie set to true`, async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, {
      enablePersonalizeCookie: true,
      webPersonalization: true,
    });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-content-sdk/events' }],
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        enablePersonalizeCookie: true,
        webPersonalization: { async: true, defer: false },
      },
      sideEffects,
    });
    expect(result).toEqual(fakeThis);
  });
  it(`should run the addPersonalize function and use async
     default values for web personalize when not provided`, async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: { defer: true } });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-content-sdk/events' }],
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        webPersonalization: { async: true, defer: true },
      },
      sideEffects,
    });
    expect(result).toEqual(fakeThis);
  });
  it(`should run the addPersonalize function and use defer
     default values for web personalize when not provided`, async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: { async: false } });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-content-sdk/events' }],
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        webPersonalization: { async: false, defer: false },
      },
      sideEffects,
    });
    expect(result).toEqual(fakeThis);
  });
  it('should run the addPersonalize function and use provided values for web personalize when object', async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, {
      webPersonalization: { async: false, defer: true },
    });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-content-sdk/events' }],
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        webPersonalization: { async: false, defer: true },
      },
      sideEffects,
    });
    expect(result).toEqual(fakeThis);
  });
  it('should run the addPersonalize function and use provided values for web personalize when object', async () => {
    const fakeThis = {};
    const result = addPersonalize.call(fakeThis as any, { webPersonalization: {} });

    expect(PackageInitializer).toHaveBeenCalledTimes(1);
    expect(PackageInitializer).toHaveBeenCalledWith({
      dependencies: [{ method: 'addEvents', name: '@sitecore-content-sdk/events' }],
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        webPersonalization: { async: true, defer: false },
      },
      sideEffects,
    });
    expect(result).toEqual(fakeThis);
  });
  it('should throw with undefined initState', async () => {
    jest.spyOn(internal, 'getEnabledPackageBrowser').mockReturnValue(undefined);

    await expect(async () => {
      await awaitInit();
    }).rejects.toThrow(ErrorMessages.IE_0016);
  });

  it('should not throw with defined initState', async () => {
    jest.spyOn(internal, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
    await expect(async () => {
      await awaitInit();
    }).not.toThrow();
  });

  it('should not throw if initState is a Promise', async () => {
    jest
      .spyOn(internal, 'getEnabledPackageBrowser')
      .mockReturnValueOnce({ initState: Promise.resolve() } as any);
    expect(async () => {
      await awaitInit();
    }).not.toThrow();
  });
});
