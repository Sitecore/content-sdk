import { PackageInitializerServer } from '@sitecore-content-sdk/__core__/internal';
import * as coreInternalModule from '@sitecore-content-sdk/__core__/internal';
import { ErrorMessages, PACKAGE_NAME, PERSONALIZE_NAMESPACE } from '../../consts';
import * as createPersonalizeCookieModule from './createPersonalizeCookie';
import * as initializerModule from './initializer';
import { verifyPersonalizePackageExistence } from './initializer';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/__core__/internal', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/__core__/internal');

  return {
    __esModule: true,
    ...originalModule,

    PackageInitializerServer: jest.fn(),
    cloudSKDRequest: {},
    cloudSKDResponse: {},
    getCloudSDKSettingsServer: jest.fn(),
    getEnabledPackageServer: jest.fn(),
    debug: jest.fn(() => jest.fn()),
  };
});

describe('sideEffects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run the side effects, debug the status and call createPersonalizeCookie if conditions met', async () => {
    jest
      .spyOn(coreInternalModule, 'getCloudSDKSettingsServer')
      .mockReturnValue({ cookieSettings: { enableServerCookie: true, name: 'bid' } } as any);

    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
      settings: { cookieSettings: { name: 'gid' }, enablePersonalizeCookie: true },
    } as any);

    const createPersonalizeCookieSpy = jest
      .spyOn(createPersonalizeCookieModule, 'createPersonalizeCookie')
      .mockImplementation(jest.fn() as any);

    await initializerModule.sideEffects();

    expect(coreInternalModule.debug).toHaveBeenCalled();
    expect(coreInternalModule.debug).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect((coreInternalModule.debug as any).mock.results[0].value.mock.calls[0][0]).toBe(
      'personalizeServer library initialized'
    );
    expect(createPersonalizeCookieSpy).toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it('should run the side effects, debug the status and NOT call createPersonalizeCookie if conditions not met', async () => {
    jest
      .spyOn(coreInternalModule, 'getCloudSDKSettingsServer')
      .mockReturnValue({ cookieSettings: { enableServerCookie: false, name: 'bid' } } as any);

    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
      settings: { cookieSettings: { name: 'gid' }, enablePersonalizeCookie: true },
    } as any);

    const createPersonalizeCookieSpy = jest
      .spyOn(createPersonalizeCookieModule, 'createPersonalizeCookie')
      .mockImplementation(jest.fn() as any);

    await initializerModule.sideEffects();

    expect(coreInternalModule.debug).toHaveBeenCalled();
    expect(coreInternalModule.debug).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect((coreInternalModule.debug as any).mock.results[0].value.mock.calls[0][0]).toBe(
      'personalizeServer library initialized'
    );
    expect(createPersonalizeCookieSpy).not.toHaveBeenCalled();
  });
});

describe('addPersonalize', () => {
  it('should run the addPersonalize function', async () => {
    const fakeThis = {};
    const result = initializerModule.addPersonalize.call(fakeThis as any);

    expect(PackageInitializerServer).toHaveBeenCalledTimes(1);
    expect(PackageInitializerServer).toHaveBeenCalledWith({
      settings: {
        cookieSettings: { name: { guestId: 'sc_undefined_personalize' } },
        enablePersonalizeCookie: false,
      },
      sideEffects: initializerModule.sideEffects,
    });
    expect(result).toEqual(fakeThis);
  });
});

describe('verifyPersonalizePackageExistence', () => {
  it('should not throw an error when the package is enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(true as any);

    expect(() => verifyPersonalizePackageExistence()).not.toThrow();
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });

  it('should throw an error when the package is not enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(false as any);

    expect(() => verifyPersonalizePackageExistence()).toThrow(ErrorMessages.IE_0017);
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });
});
