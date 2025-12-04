import { getEnabledPackage, initCoreState } from './initializer';
import type { PackageContext, PackageContextDependency } from './interfaces';

export class PackageInitializer {
  /* eslint-disable @typescript-eslint/naming-convention */
  private _initState: Promise<void> | null = null;
  private _settings?: unknown;
  private _sideEffects: () => Promise<void>;
  private _dependencies: PackageContextDependency[];

  /* eslint-enable @typescript-eslint/naming-convention */
  constructor(packageContext: PackageContext) {
    this._sideEffects = packageContext.sideEffects;
    this._settings = packageContext.settings;
    this._dependencies = packageContext.dependencies ?? [];
  }

  private validatePackages() {
    const validatedPackages: PackageInitializer[] = [];
    this._dependencies.forEach((dependency) => {
      // The package name is the name found in each package's package.json file e.g. @sitecore-cloudsdk/core"
      const depName = dependency.name.split('/')[1];
      const pkg = getEnabledPackage(dependency.name);

      if (!pkg)
        throw new Error(
          // eslint-disable-next-line max-len
          `[IE-0020] - This functionality also requires the "${depName}" package. Import "${dependency.name}/browser", then run ".${dependency.method}()" on "CloudSDK", before ".initialize()"`
        );

      validatedPackages.push(pkg);
    });

    return validatedPackages;
  }

  exec() {
    const validatedPackages = this.validatePackages();
    this._initState = this.wrapSideEffects(validatedPackages);
  }

  private async wrapSideEffects(validatedPackages: PackageInitializer[]) {
    await initCoreState;

    await Promise.all(validatedPackages.map((pkg) => pkg.initState));

    this._sideEffects();
  }

  get initState() {
    return this._initState;
  }

  get settings() {
    return this._settings;
  }
}
