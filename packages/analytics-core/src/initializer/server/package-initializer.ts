import { getEnabledPackage } from './initializer';
import type { PackageContext, PackageContextDependencyServer } from './interfaces';

/**
 * Package initializer for server environments.
 * This class is used by other packages to plugin to the core CloudSDK initializer.
 * It manages package dependencies, settings, and side effects execution on the server.
 */
export class PackageInitializerServer {
  private _settings: unknown;
  private _sideEffects: () => Promise<void>;
  private _dependencies: PackageContextDependencyServer[];
  /**
   * Creates a new PackageInitializerServer instance.
   * @param {PackageContext} packageContext - The package context containing side effects, settings, and dependencies.
   */
  constructor(packageContext: PackageContext) {
    this._sideEffects = packageContext.sideEffects;
    this._settings = packageContext.settings;
    this._dependencies = packageContext.dependencies ?? [];
  }

  /**
   * Gets the package-specific settings.
   * @returns {unknown} The package settings.
   */
  get settings(): unknown {
    return this._settings;
  }

  /**
   * Executes the package initialization.
   * Validates dependencies and executes side effects.
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   */
  async exec(): Promise<void> {
    this.checkDependencies();
    await this._sideEffects();
  }

  /**
   * Checks that all package dependencies are enabled.
   * @throws {Error} If a required dependency is not enabled.
   */
  private checkDependencies() {
    this._dependencies.forEach((dependency) => {
      // The package name is the name found in each package's package.json file e.g. @sitecore-content-sdk/analytics-core"
      const depName = dependency.name.split('/')[1];

      if (!getEnabledPackage(dependency.name))
        throw new Error( // eslint-disable-next-line max-len
          `[IE-0021] - This functionality also requires the "${depName}" package. Import "${dependency.name}/server", then run ".${dependency.method}()" on "CloudSDK", before ".initialize()"`
        );
    });
  }
}
