import * as initializerModule from './initializer';
import type { PackageContext } from './interfaces';
import { PackageInitializer } from './package-initializer';

describe('PackageInitializer', () => {
  let pkgContext: PackageContext;

  beforeEach(() => {
    pkgContext = {
      settings: { someSetting: 'someValue' },
      sideEffects: jest.fn().mockResolvedValue(undefined)
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should throw error if has uninitialized dependencies', () => {
    pkgContext.dependencies = [{ method: 'addEvents', name: '@sitecore-cloudsdk/events' }];

    jest.spyOn(initializerModule, 'getEnabledPackage').mockReturnValue(undefined);

    const initializer = new PackageInitializer(pkgContext);

    expect(() => initializer.exec()).toThrow(
      // eslint-disable-next-line max-len
      '[IE-0020] - This functionality also requires the "events" package. Import "@sitecore-cloudsdk/events/browser", then run ".addEvents()" on "CloudSDK", before ".initialize()"'
    );
  });
  it('should not throw error if has valid dependencies', () => {
    pkgContext.dependencies = [{ method: 'init', name: 'core/package' }];

    jest
      .spyOn(initializerModule, 'getEnabledPackage')
      .mockReturnValue(new PackageInitializer({ sideEffects: jest.fn() }));

    const initializer = new PackageInitializer(pkgContext);

    expect(() => initializer.exec()).not.toThrow('You must first initialize package. Call init on CloudSDK.');
  });

  it('should await all dependencies', async () => {
    const wrapSideEffectsSpy = jest.spyOn(PackageInitializer.prototype as any, 'wrapSideEffects');

    const dependency1 = new PackageInitializer({ sideEffects: jest.fn() });
    dependency1.exec();

    jest.spyOn(initializerModule, 'getEnabledPackage').mockReturnValue(dependency1);

    const initStateSpy = jest.spyOn(dependency1, 'initState', 'get');

    const packageInitializer = new PackageInitializer({
      dependencies: [{ method: 'test', name: 'test' }],
      sideEffects: jest.fn()
    });

    packageInitializer.exec();

    await packageInitializer.initState;

    expect(initStateSpy).toHaveBeenCalled();
    expect(wrapSideEffectsSpy).toHaveBeenLastCalledWith([dependency1]);
  });

  it('should return correct settings', () => {
    const initializer = new PackageInitializer(pkgContext);
    expect(initializer.settings).toEqual(pkgContext.settings);
  });

  it('should initialize with the given sideEffects function', () => {
    const packageInitializer = new PackageInitializer(pkgContext);

    expect(packageInitializer).toBeInstanceOf(PackageInitializer);
    expect(packageInitializer.initState).toBeNull();
  });

  it('should call wrapSideEffects when exec is called', async () => {
    const packageInitializer = new PackageInitializer(pkgContext);

    packageInitializer.exec();

    expect(packageInitializer.initState).toBeInstanceOf(Promise);
    await packageInitializer.initState;
    expect(pkgContext.sideEffects).toHaveBeenCalled();
  });

  it('should wait for initCoreState before calling sideEffects', async () => {
    const delayedInitCoreState = new Promise<void>((resolve) => setTimeout(resolve, 100));
    jest.spyOn(Promise, 'resolve').mockReturnValueOnce(delayedInitCoreState);

    const packageInitializer = new PackageInitializer(pkgContext);

    packageInitializer.exec();

    const sideEffectsPromise = packageInitializer.initState;

    let sideEffectsCalled = false;

    sideEffectsPromise?.then(() => {
      sideEffectsCalled = true;
    });

    expect(sideEffectsCalled).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 50)); // Less than delay

    await delayedInitCoreState;
    await sideEffectsPromise;

    expect(pkgContext.sideEffects).toHaveBeenCalled();
    expect(sideEffectsCalled).toBe(true);
  });
});
