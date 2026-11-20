import { useEffect } from 'react';
import { getOmittedJavascriptUrlMessage } from '@sitecore-content-sdk/core/tools';

/**
 * Logs javascript: URLs removed from field HTML once per mounted component,
 * and again only when the removed URLs change.
 * @param {string[]} omittedUrls URLs removed from the rendered HTML
 */
export function useOmittedJavascriptUrlLog(omittedUrls: string[]): void {
  // A stable key, so a new array with the same URLs does not log again.
  const key = omittedUrls.length ? JSON.stringify(omittedUrls) : '';

  useEffect(() => {
    if (!key) {
      return;
    }

    (JSON.parse(key) as string[]).forEach((url) =>
      console.error(getOmittedJavascriptUrlMessage(url))
    );
  }, [key]);
}
