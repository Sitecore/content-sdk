import { language } from '@sitecore-content-sdk/analytics-core/internal';
import type { NestedObject } from '@sitecore-content-sdk/analytics-core/utils';
import { ERROR_MESSAGES, UTM_PREFIX } from '../consts';
import type { EPCallFlowsBody, FailedCalledFlowsResponse } from './send-call-flows-request';
import { sendCallFlowsRequest } from './send-call-flows-request';
import { CoreContext } from '@sitecore-content-sdk/core';

/**
 * The Personalizer Class runs a flow of interactive experiments.
 * @internal
 */
export class Personalizer {
  /**
   * The Personalizer Class runs a flow of interactive experiments.
   * @param {string} clientId - The client id of the user
   * @param {string} [profileId] - The profile id of the user
   */
  constructor(private clientId: string, private profileId?: string) {}

  /**
   * A function to make a request to the Sitecore Edge Proxy `/callFlows` API endpoint
   * @param {PersonalizeData} personalizeData - The personalize input from the developer
   * @param {CoreContext['config']} config - The configuration that was set during initialization
   * @param {string} searchParams - The URL search parameters
   * @param {GetInteractiveExperienceDataOpts} opts - Optional object that contains options for timeout and User Agent
   * @returns {Promise<unknown | null | FailedCalledFlowsResponse>} A promise that resolves with either the Sitecore Edge Proxy response object or null
   */
  async getInteractiveExperienceData(
    personalizeData: PersonalizeData,
    config: CoreContext['config'],
    searchParams: string,
    opts?: GetInteractiveExperienceDataOpts
  ): Promise<unknown | null | FailedCalledFlowsResponse> {
    this.validate(personalizeData);

    const sanitizedInput = this.sanitizeInput(personalizeData);

    if (searchParams.includes(UTM_PREFIX) && !sanitizedInput.params?.utm) {
      sanitizedInput.params = sanitizedInput.params || {};
      sanitizedInput.params.utm = this.extractUrlParamsWithPrefix(searchParams, UTM_PREFIX);
    }

    const mappedData = this.mapPersonalizeInputToEPData(sanitizedInput);
    if (!mappedData.email && !mappedData.identifiers) mappedData.browserId = this.clientId;

    return await sendCallFlowsRequest(mappedData, config, opts);
  }

  /**
   * A function that sanitizes the personalize input data
   * @param {PersonalizeData} personalizeData - The personalize input data to sanitize
   * @returns {PersonalizeData} The sanitized object
   */
  private sanitizeInput(personalizeData: PersonalizeData) {
    const sanitizedData: PersonalizeData = {
      channel: personalizeData.channel,
      currency: personalizeData.currency,
      friendlyId: personalizeData.friendlyId,
      language: personalizeData.language,
    };

    if (
      personalizeData.identifier &&
      personalizeData.identifier.id &&
      personalizeData.identifier.id.trim().length > 0
    )
      sanitizedData.identifier = personalizeData.identifier;

    if (personalizeData.email && personalizeData.email.trim().length > 0)
      sanitizedData.email = personalizeData.email;

    if (personalizeData.params && Object.keys(personalizeData.params).length > 0)
      sanitizedData.params = personalizeData.params;

    if (personalizeData.geo && Object.keys(personalizeData.geo).length > 0)
      sanitizedData.params = { ...personalizeData.params, geo: { ...personalizeData.geo } };

    if (personalizeData.pageVariantIds?.length)
      sanitizedData.pageVariantIds = personalizeData.pageVariantIds;

    return sanitizedData;
  }
  /**
   * A function that maps the personalize input data with the Edge Proxy
   * @param {PersonalizeData} input - The personalize input data to map
   * @returns {EPCallFlowsBody} The Edge Proxy object
   */
  private mapPersonalizeInputToEPData(input: PersonalizeData): EPCallFlowsBody {
    const mappedData: EPCallFlowsBody = {
      channel: input.channel,
      clientKey: '',
      currencyCode: input.currency,
      email: input.email,
      friendlyId: input.friendlyId,
      guestRef: this.profileId,
      identifiers: input.identifier,
      language: input.language ?? language(),
      params: input.params,
      pointOfSale: '',
      variants: input.pageVariantIds,
    };

    return mappedData;
  }

  /**
   * A validation method to throw error for the mandatory property for runtime users
   * @param {PersonalizeData} params - The personalize data object
   */
  private validate(params: PersonalizeData) {
    if (!params.friendlyId || params.friendlyId.trim().length === 0)
      throw new Error(ERROR_MESSAGES.MV_004);
  }

  /**
   * Retrieves UTM parameters from the url query string e.g. `utm_test1=123&utm_test2=456`
   * @param {string} urlParams - The url params passed
   * @param {string} prefix - The prefix we want to extract from the params
   * @returns {{ [key: string]: string }} An object containing the UTM parameters (if they exist) in the form: `utm: {test1: 123, test2: 456}`
   */
  private extractUrlParamsWithPrefix(urlParams: string, prefix: string): { [key: string]: string } {
    const urlSearchParams = new URLSearchParams(decodeURI(urlParams));
    const extractedParams: { [key: string]: string } = {};

    urlSearchParams.forEach((value: string, key: string) => {
      const paramKey = key.toLowerCase();

      if (paramKey.indexOf(prefix) === 0) {
        const paramName = paramKey.substring(prefix.length);
        extractedParams[paramName] = value;
      }
    });

    return extractedParams;
  }
}

/**
 * An interface that describes the geolocation attributes.
 * @public
 */
export interface PersonalizeGeolocation {
  /**
   * The site visitor's city.
   *
   * Format: title case recommended.
   */
  city?: string;
  /**
   * The site visitor's country.
   *
   * Format: uppercase ISO 3166-1 alpha-2.
   */
  country?: string;
  /**
   * The site visitor's region.
   * Depends on the regional structure of the country.
   *
   * Format: for example, for Australia, use state and territory abbreviations. For the United States, use ANSI standard INCITS 38:2009.
   */
  region?: string;
}

/**
 * An interface that describes the flow execution model attributes input for the library
 * @public
 */
export interface PersonalizeData {
  /**
   * The touchpoint where the user interacts with your brand.
   * For example, for webpages, the channel is "WEB". For mobile app screens, the channel is "MOBILE_APP".
   *
   * Format: uppercase.
   */
  channel: string;
  /**
   * The alphabetic currency code of the currency the site visitor uses in your app.
   * For example, if the site visitor selects Australian dollars as the currency, the currency is "AUD".
   *
   * Format: uppercase ISO 4217.
   */
  currency?: string;
  /**
   * The site visitor's email address.
   *
   * Format: lowercase recommended.
   */
  email?: string;
  /**
   * The unique identifier of the live interactive experience or experiment to run.
   * To find the friendly ID in Sitecore Personalize, click the live experience or experiment to run, then click Build summary. The friendly ID is in the Details pane.
   */
  friendlyId: string;
  /**
   * The site visitor's geolocation data.
   */
  geo?: PersonalizeGeolocation;
  /**
   * The identifiers used for identifying site visitors.
   *
   * If set, the experience or experiment runs only for the identified site visitor.
   */
  identifier?: PersonalizeIdentifierInput;
  /**
   * The language the site visitor interacts with your brand in.
   * For example, if the site visitor selects the Japanese language in your app, the language is "JA".
   *
   * Format: uppercase ISO 639.
   *
   * Default for browser-side events: inferred from the HTML lang attribute. If lang is not specified, the default is an empty string.
   *
   * Default for server-side events: empty string.
   */
  language?: string;
  /**
   * An object of your choice.
   *
   * If the URL of the webpage where this function runs contains UTM parameters, those parameters are automatically captured in params.utm.
   *
   * To override the automatically captured UTM parameters, specify values manually in params.utm.
   */
  params?: PersonalizeInputParams;
  /**
   * A list of IDs of personalized page variants.
   *
   * Ensures that the correct variants are rendered for personalization.
   *
   * If unset or an empty array, this property will not be part of the payload.
   */
  pageVariantIds?: string[];
}

/**
 * An interface that describes the identifier model attributes for the library
 * @public
 */
export interface PersonalizeIdentifierInput {
  /**
   * The unique guest (site visitor) identifier provided by your organization's identity system, such as a Customer Relationship Management (CRM) system.
   */
  id: string;
  /**
   * The name of your organization's identity system, external to SitecoreAI, that provided the unique guest (site visitor) identifier.
   */
  provider: string;
}

/**
 * A type that describes the params field
 * @public
 */
export type PersonalizeInputParams = NestedObject;

/**
 * Options for the getInteractiveExperienceData method
 * @internal
 */
export interface GetInteractiveExperienceDataOpts {
  /**
   * Timeout in milliseconds for the personalize request
   */
  timeout?: number;
  /**
   * Optional user agent string
   */
  userAgent?: string | null;
}
