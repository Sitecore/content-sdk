import * as core from '@sitecore-content-sdk/analytics-core/internal';
import { ErrorMessages, EVENTS_NAMESPACE, PACKAGE_VERSION } from '../../consts';
import { addEvents, awaitInit, sideEffects } from './initializer';
import * as initModule from './initializer';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/utils', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line @typescript-eslint/naming-convention
  };
});
jest.mock('@sitecore-content-sdk/analytics-core/internal', () => {
  const originalModule: object = jest.requireActual(
    '@sitecore-content-sdk/analytics-core/internal'
  );

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PackageInitializer: jest.fn(),
  };
});

describe('sideEffects', () => {
  it('should add the library properties to window.scCloudSDK object', async () => {
    const debugSpy = jest.spyOn(core, 'debug');
    const eventProperties = [
      'pageView',
      'identity',
      'form',
      'event',
      'addToEventQueue',
      'processEventQueue',
      'clearEventQueue',
      'version',
    ];

    global.window.scCloudSDK = undefined as any;
    expect(global.window.scCloudSDK).toBeUndefined();
    await sideEffects();
    expect(global.window.scCloudSDK.events.version).toEqual(PACKAGE_VERSION);
    eventProperties.forEach((property) => {
      expect((window.scCloudSDK.events as any)[property]).toBeDefined();
    });

    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).toHaveBeenCalledWith(EVENTS_NAMESPACE);
    expect((debugSpy as any).mock.results[0].value).toBeInstanceOf(Function);
  });
});

describe('addEvents', () => {
  it('should run the addEvents function', async () => {
    const fakeThis = {};

    const result = addEvents.call(fakeThis as any);

    expect(core.PackageInitializer).toHaveBeenCalledTimes(1);
    expect(core.PackageInitializer).toHaveBeenCalledWith({ sideEffects });
    expect(result).toEqual(fakeThis);
  });
});

describe('awaitInit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if initState promise is null', async () => {
    const getEnabledPackageSpy = jest.spyOn(core, 'getEnabledPackageBrowser');
    getEnabledPackageSpy.mockReturnValueOnce({ initState: null } as any);

    await expect(async () => {
      await awaitInit();
    }).rejects.toThrow(ErrorMessages.IE_0014);
  });

  it('should throw error if package is not enabled', async () => {
    const getEnabledPackageSpy = jest.spyOn(core, 'getEnabledPackageBrowser');
    getEnabledPackageSpy.mockReturnValueOnce(undefined);

    await expect(async () => {
      await awaitInit();
    }).rejects.toThrow(ErrorMessages.IE_0014);
  });

  it('should not throw if initState is a Promise', async () => {
    const getEnabledPackageSpy = jest
      .spyOn(core, 'getEnabledPackageBrowser')
      .mockReturnValueOnce({ initState: Promise.resolve() } as any);

    await initModule.awaitInit();

    expect(getEnabledPackageSpy).toHaveBeenCalledTimes(1);
  });
});
