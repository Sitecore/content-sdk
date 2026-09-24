/**
 * Next.js image config fields that `next/image` sorts in place.
 * Frozen arrays throw `TypeError` during production SSR (Vercel / Node 24).
 * @see https://github.com/vercel/next.js/issues/94740
 */
export type NextImageConfigLike = {
  deviceSizes?: readonly number[];
  imageSizes?: readonly number[];
  qualities?: readonly number[] | undefined;
};

/**
 * Returns a shallow clone of a Next.js image config with mutable size/quality arrays.
 * `next/image` calls `.sort()` on `deviceSizes` and `qualities`; frozen arrays crash SSR.
 * @param {T} config - Image config from `ImageConfigContext` or `next.config` images.
 * @returns {T} Cloned config whose `deviceSizes`, `imageSizes`, and `qualities` can be sorted.
 * @internal
 */
export function cloneNextImageConfig<T extends NextImageConfigLike>(config: T): T {
  return {
    ...config,
    deviceSizes: config.deviceSizes ? [...config.deviceSizes] : config.deviceSizes,
    imageSizes: config.imageSizes ? [...config.imageSizes] : config.imageSizes,
    qualities: config.qualities ? [...config.qualities] : config.qualities,
  } as T;
}

/**
 * Whether an error is the V8 TypeError from in-place `.sort()` on a frozen array.
 * @param {unknown} error - Error thrown while rendering or resolving `next/image` props.
 * @returns {boolean} True when the message matches a read-only index assignment from `Array.sort`.
 * @internal
 */
export function isReadonlyArraySortError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    typeof error.message === 'string' &&
    error.message.includes('read only property')
  );
}

/**
 * Runs `next/image` prop resolution and reports whether in-place config sorting is safe.
 * Used as a preflight so SSR can fall back to a native `img` instead of returning 500.
 * @param {() => void} resolveImageProps - Callback that invokes `getImageProps` (or equivalent).
 * @returns {boolean} False only for the frozen-array sort TypeError; true otherwise.
 * @internal
 */
export function canSafelyResolveNextImageProps(resolveImageProps: () => void): boolean {
  try {
    resolveImageProps();
    return true;
  } catch (error) {
    if (isReadonlyArraySortError(error)) {
      return false;
    }
    // Preserve current NextImage behavior for missing width/height and other validation errors.
    return true;
  }
}
