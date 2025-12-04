import * as initializerModule from './initializer';
import type { PackageContext } from './interfaces';
import { PackageInitializerServer } from './package-initializer';

describe('PackageInitializerServer', () => {
  let pkgContext: PackageContext;

  beforeEach(() => {
    pkgContext = {
      settings: { someSetting: 'someValue' },
      sideEffects: jest.fn().mockResolvedValue(undefined)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if has uninitialized dependencies', async () => {
    pkgContext.dependencies = [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }];

    jest.spyOn(initializerModule, 'getEnabledPackage').mockReturnValue(undefined);

    const initializer = new PackageInitializerServer(pkgContext);

    await expect(async () => await initializer.exec()).rejects.toThrow(
      // eslint-disable-next-line max-len
      '[IE-0021] - This functionality also requires the "events" package. Import "@sitecore-cloudsdk/events/server", then run ".addEvents()" on "CloudSDK", before ".initialize()"'
    );
  });

  it('should not throw error if has valid dependencies', async () => {
    pkgContext.dependencies = [{ method: 'init', name: 'core/package' }];

    jest
      .spyOn(initializerModule, 'getEnabledPackage')
      .mockReturnValue(new PackageInitializerServer({ sideEffects: jest.fn() }));

    const initializer = new PackageInitializerServer(pkgContext);

    expect(async () => await initializer.exec()).not.toThrow();
  });

  it('should return correct settings', () => {
    const initializer = new PackageInitializerServer(pkgContext);
    expect(initializer.settings).toEqual(pkgContext.settings);
  });

  it('should call side effects when exec is called', async () => {
    const packageInitializer = new PackageInitializerServer(pkgContext);

    await packageInitializer.exec();

    expect(pkgContext.sideEffects).toHaveBeenCalled();
  });
});
