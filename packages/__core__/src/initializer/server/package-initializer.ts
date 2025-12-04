import { getEnabledPackage } from './initializer';
import type { PackageContext, PackageContextDependencyServer } from './interfaces';

export class PackageInitializerServer {
  /* eslint-disable @typescript-eslint/naming-convention */
  private _settings: unknown;
  private _sideEffects: () => Promise<void>;
  private _dependencies: PackageContextDependencyServer[];
  /* eslint-enable @typescript-eslint/naming-convention */
  constructor(packageContext: PackageContext) {
    this._sideEffects = packageContext.sideEffects;
    this._settings = packageContext.settings;
    this._dependencies = packageContext.dependencies ?? [];
  }

  private checkDependencies() {
    this._dependencies.forEach((dependency) => {
      // The package name is the name found in each package's package.json file e.g. @sitecore-cloudsdk/core"
      const depName = dependency.name.split('/')[1];

      if (!getEnabledPackage(dependency.name))
        throw new Error( // eslint-disable-next-line max-len
          `[IE-0021] - This functionality also requires the "${depName}" package. Import "${dependency.name}/server", then run ".${dependency.method}()" on "CloudSDK", before ".initialize()"`
        );
    });
  }

  async exec() {
    this.checkDependencies();
    await this._sideEffects();
  }

  get settings() {
    return this._settings;
  }
}
