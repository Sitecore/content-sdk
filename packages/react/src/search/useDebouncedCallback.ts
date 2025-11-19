import { useCallback, useRef, useEffect } from 'react';

/**
 * Creates a debounced version of a callback function.
 * @param {Function} cb - The callback function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} The debounced callback function.
 * @internal
 */
export const useDebouncedCallback = <T extends unknown[]>(
  cb: (...args: T) => void,
  delay: number
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => cb(...args), delay);
    },
    [cb, delay]
  );
};
