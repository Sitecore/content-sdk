import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import { getCoreSettings } from '@sitecore-content-sdk/core';
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
  const coreSettings = getCoreSettings();
  await coreSettings.readyPromise;
  getEventsPlugin();

  const { settings, environment } = getAnalyticsPlugin();

  const id = environment.getBrowserId() || '';

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
    settings: { ...coreSettings.settings, ...settings },
  });

  formEvent.page = undefined as unknown as string;

  return formEvent.send();
}
