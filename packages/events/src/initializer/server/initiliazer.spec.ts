import * as coreInternalModule from '@sitecore-content-sdk/__core__/internal';
import { PackageInitializerServer } from '@sitecore-content-sdk/__core__/internal';
import { ErrorMessages, EVENTS_NAMESPACE, PACKAGE_NAME } from '../../consts';
import { addEvents, sideEffects, verifyEventsPackageExistence } from './initializer';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/__core__/internal', () => {
  const originalModule: object = jest.requireActual('@sitecore-content-sdk/__core__/internal');

  return {
    __esModule: true,
    ...originalModule,
    PackageInitializerServer: jest.fn(),
  };
});

describe('sideEffects', () => {
  it('should run the side effects and debug the status', async () => {
    const debugMock = jest.spyOn(coreInternalModule, 'debug');

    await sideEffects();

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenCalledWith(EVENTS_NAMESPACE);
    expect(debugMock.mock.results[0].value).toBeInstanceOf(Function);
  });
});

describe('addEvents', () => {
  it('should run the addEvents function', async () => {
    const fakeThis = {};
    const result = addEvents.call(fakeThis as any);

    expect(PackageInitializerServer).toHaveBeenCalledTimes(1);
    expect(PackageInitializerServer).toHaveBeenCalledWith({ sideEffects });
    expect(result).toEqual(fakeThis);
  });
});

describe('verifyEventsPackageExistence', () => {
  it('should not throw an error when the package is enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(true as any);

    expect(() => verifyEventsPackageExistence()).not.toThrow();
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });

  it('should throw an error when the package is not enabled', () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(false as any);

    expect(() => verifyEventsPackageExistence()).toThrow(ErrorMessages.IE_0015);
    expect(coreInternalModule.getEnabledPackageServer).toHaveBeenCalledWith(PACKAGE_NAME);
  });
});
