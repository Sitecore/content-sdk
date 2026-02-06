import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { sendEvent } from '../send-event/sendEvent';
import type { IdentityData } from './identity-event';
import { IdentityEvent } from './identity-event';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getEventsPlugin } from '../../initialization/plugin';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 * @param {IdentityData} identityData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export async function identity(identityData: IdentityData): Promise<EPResponse | null> {
  const coreContext = getCoreContext();
  await coreContext.readyPromise;
  getEventsPlugin();

  const { options, adapter } = getAnalyticsPlugin();

  const id = adapter.getClientId() || '';

  return new IdentityEvent({
    id,
    identityData,
    sendEvent,
    config: { ...coreContext.config, ...options },
  }).send();
}
