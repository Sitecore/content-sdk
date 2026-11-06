// Always false constant to import in the non-RSC contexts using conditional imports
export const rsc = false;

/**
 * Client stand-in for the Design Library runtime loader.
 * `global-error` resolves this module and does not reference `DesignLibraryServer`.
 * @returns {Promise<{ DesignLibraryRuntime: () => null }>} A runtime that renders nothing.
 */
export const loadDesignLibraryRuntime = (): Promise<{
  DesignLibraryRuntime: () => null;
}> => Promise.resolve({ DesignLibraryRuntime: () => null });
