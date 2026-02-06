import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getEventsPlugin } from '../../initialization/plugin';

/**
 * A function that sends a form event to SitecoreCloud API
 * @param {string} formId - The required form ID string
 * @param {'VIEWED' | 'SUBMITTED'} interactionType - The required interaction type string. Possible values: "VIEWED", "SUBMITTED"
 * @param {string} componentInstanceId - The required component instance ID string
 * @returns The response object that Sitecore EP returns or null
 */
export async function form(
  formId: string,
  interactionType: 'VIEWED' | 'SUBMITTED',
  componentInstanceId: string
): Promise<EPResponse | null> {
  const coreContext = getCoreContext();
  await coreContext.readyPromise;
  getEventsPlugin();

  const { options, adapter } = getAnalyticsPlugin();

  const id = adapter.getClientId() || '';

  const formEvent = new CustomEvent({
    eventData: {
      extensionData: {
        componentInstanceId,
        formId,
        interactionType: interactionType.toUpperCase(),
      },
      type: 'FORM',
    },
    id,
    sendEvent,
    config: { ...coreContext.config, ...options },
  });

  formEvent.page = undefined as unknown as string;

  return formEvent.send();
}
