import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import type { PersonalizeData } from './personalizer';
import { Personalizer } from './personalizer';
import type { FailedCalledFlowsResponse } from './send-call-flows-request';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getPersonalizePlugin } from '../initialization/shared';

/**
 * A function that executes an interactive experiment or web experiment over any web-based or mobile application.
 * @param {PersonalizeData} personalizeData - The required/optional attributes in order to create a flow execution
 * @param {PersonalizeOpts} opts - An object containing additional options
 * @returns {Promise<unknown | null | FailedCalledFlowsResponse>} A flow execution response
 * @public
 */
export async function personalize(
  personalizeData: PersonalizeData,
  opts?: PersonalizeOpts
): Promise<unknown | null | FailedCalledFlowsResponse> {
  const { settings, readyPromise } = getCoreContext();
  await readyPromise;
  const { adapter: personalizeAdapter } = getPersonalizePlugin();

  const { adapter: analyticsAdapter } = getAnalyticsPlugin();

  const clientId = analyticsAdapter.getClientId() || '';
  const guestId = personalizeAdapter.getGuestId() || '';
  const searchParams = analyticsAdapter.location.getSearchParams();
  const userAgent = personalizeAdapter.getUserAgent?.();

  return new Personalizer(clientId, guestId).getInteractiveExperienceData(
    personalizeData,
    settings,
    searchParams,
    {
      userAgent,
      timeout: opts?.timeout,
    }
  );
}

/**
 * Options for the personalize function
 */
interface PersonalizeOpts {
  /**
   * Timeout in milliseconds for the personalize request
   */
  timeout?: number;
}
