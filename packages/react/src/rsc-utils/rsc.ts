// Always true constant to import in the RSC environment using conditional imports
export const rsc = true;

/**
 * Loads the Design Library runtime for the RSC bundle.
 * The client bundle resolves `no-rsc.ts` instead, so `global-error` does not reference `DesignLibraryServer`.
 * @returns {Promise<typeof import('../components/DesignLibrary/DesignLibraryRuntime')>} The Design Library runtime module.
 */
export const loadDesignLibraryRuntime = () =>
  import('../components/DesignLibrary/DesignLibraryRuntime');
