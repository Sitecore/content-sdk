import { getEnabledPackage, initCoreState } from './initializer';
import type { PackageContext, PackageContextDependency } from './interfaces';

/**
 * Package initializer for browser environments.
 * This class is used by other packages to plugin to the core CloudSDK initializer.
 * It manages package dependencies, initialization state, and side effects execution.
 */
export class PackageInitializer {
  private _initState: Promise<void> | null = null;
  private _settings?: unknown;
  private _sideEffects: () => Promise<void>;
  private _dependencies: PackageContextDependency[];

  /**
   * Creates a new PackageInitializer instance.
   * @param {PackageContext} packageContext - The package context containing side effects, settings, and dependencies.
   */
  constructor(packageContext: PackageContext) {
    this._sideEffects = packageContext.sideEffects;
    this._settings = packageContext.settings;
    this._dependencies = packageContext.dependencies ?? [];
  }

  /**
   * Gets the initialization state promise.
   * @returns {Promise<void> | null} The initialization state promise or null if not started.
   */
  get initState() {
    return this._initState;
  }

  /**
   * Gets the package-specific settings.
   * @returns {unknown} The package settings.
   */
  get settings() {
    return this._settings;
  }

  /**
   * Executes the package initialization.
   * Validates dependencies and wraps side effects execution.
   */
  exec() {
    const validatedPackages = this.validatePackages();
    this._initState = this.wrapSideEffects(validatedPackages);
  }

  /**
   * Validates that all package dependencies are enabled and initialized.
   * @returns {PackageInitializer[]} Array of validated package initializers.
   * @throws {Error} If a required dependency is not enabled.
   */
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

  /**
   * Wraps the execution of package side effects.
   * Ensures core initialization and dependency initialization are complete before executing.
   * @param {PackageInitializer[]} validatedPackages - The validated package dependencies.
   * @returns {Promise<void>} A promise that resolves when side effects are complete.
   */
  private async wrapSideEffects(validatedPackages: PackageInitializer[]) {
    await initCoreState;

    await Promise.all(validatedPackages.map((pkg) => pkg.initState));

    this._sideEffects();
  }
}
