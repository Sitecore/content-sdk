import type { EPResponse, Infer } from '@sitecore-content-sdk/analytics-core/internal';
import type { EventAttributesInput, ExtensionData } from '../common-interfaces';
import {
  flattenObject,
  isValidISODateOnlyString,
  isValidISODateAndTimeString,
  isValidEmail,
} from '@sitecore-content-sdk/analytics-core/utils';
import { BaseEvent } from '../base-event';
import type { FlattenedObject } from '@sitecore-content-sdk/analytics-core/utils';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import type { SendEvent } from '../send-event/sendEvent';
import { CoreContext, constants } from '@sitecore-content-sdk/core';

const { ERROR_MESSAGES } = constants;

/**
 * A class that extends from {@link BaseEvent} and has all the required functionality to send an IDENTITY event
 */
export class IdentityEvent extends BaseEvent {
  private identityData: IdentityData;
  private sendEvent: SendEvent;
  private extensionData: FlattenedObject = {};
  private numberOfExtensionDataProperties = 0;
  private config: CoreContext['config'];

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send an IDENTITY event
   * @param {IdentityEventArguments} args - Unified object containing the required properties
   */
  constructor(args: IdentityEventArguments) {
    const { channel, currency, language, page, extensionData } = args.identityData;

    super({ channel, currency, language, page }, args.id);

    this.validateAttributes(args.identityData);

    this.identityData = args.identityData;
    this.sendEvent = args.sendEvent;
    this.config = args.config;

    if (extensionData) this.extensionData = flattenObject({ object: extensionData });

    this.numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (this.numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES)
      throw new Error(ERROR_MESSAGES.IV_006(MAX_EXT_ATTRIBUTES));
  }

  /**
   * Sends the event to Sitecore Edge Proxy
   * @returns - A promise that resolves with either the Sitecore Edge Proxy response object or null
   */
  async send(): Promise<EPResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const eventAttrs = this.mapAttributes();
    const fetchBody = Object.assign({}, eventAttrs, baseAttr);

    return await this.sendEvent(fetchBody, this.config);
  }

  /**
   * Function that validates the identifiers object, email, and date attributes for CDN users
   * @param {IdentityData} identityData - The data to be validated
   */
  private validateAttributes(identityData: IdentityData) {
    if (identityData.identifiers.length === 0) throw new Error(ERROR_MESSAGES.MV_003);

    if (identityData.dob !== undefined && !isValidISODateOnlyString(identityData.dob))
      throw new Error(ERROR_MESSAGES.IV_003);

    identityData.identifiers.forEach((identifier: Identifier) => {
      if (identifier.expiryDate && !isValidISODateAndTimeString(identifier.expiryDate))
        throw new Error(ERROR_MESSAGES.IV_005);
    });

    if (identityData.email && !isValidEmail(identityData.email))
      throw new Error(ERROR_MESSAGES.IV_004);
  }

  /**
   * A function that maps the identity event input data with the payload sent to the API
   * @returns - The payload object
   */
  private mapAttributes(): IdentityEventPayload {
    const identityPayload: IdentityEventPayload = {
      city: this.identityData.city,
      country: this.identityData.country,
      dob: this.identityData.dob,
      email: this.identityData.email,
      firstname: this.identityData.firstName,
      gender: this.identityData.gender,
      identifiers: this.identityData.identifiers.map((value: Identifier): EPIdentifier => {
        return {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          expiry_date: value.expiryDate,
          id: value.id,
          provider: value.provider,
        };
      }),
      lastname: this.identityData.lastName,
      mobile: this.identityData.mobile,
      phone: this.identityData.phone,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      postal_code: this.identityData.postalCode,
      state: this.identityData.state,
      street: this.identityData.street,
      title: this.identityData.title,
      type: 'IDENTITY',
    };

    if (this.numberOfExtensionDataProperties > 0) identityPayload.ext = this.extensionData;

    return identityPayload;
  }
}

/**
 * The JSON array of objects that contain the identity identifiers
 * @internal
 */
interface EPIdentifier {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  expiry_date?: string;
  id: string;
  provider: string;
}

/**
 * Interface with the necessary attributes for the input for sending identity events
 * @public
 */
export interface IdentityData extends EventAttributesInput {
  /**
   * The site visitor's city address.
   *
   * Format: title case recommended.
   */
  city?: string;
  /**
   * The site visitor's country address.
   *
   * Format: uppercase ISO 3166-1 alpha-2.
   */
  country?: string;
  /**
   * The site visitor's date of birth.
   *
   * Format: date only, YYYY-MM-DD.
   */
  dob?: string;
  /**
   * The site visitor's email address.
   *
   * Format: lowercase recommended.
   */
  email?: string;
  /**
   * The site visitor's first name.
   *
   * Format: title case recommended.
   */
  firstName?: string;
  /**
   * The site visitor's gender.
   */
  gender?: string;
  /**
   * The identifiers used for identifying site visitors.
   */
  identifiers: Identifier[];
  /**
   * The site visitor's last name.
   *
   * Format: title case recommended.
   */
  lastName?: string;
  /**
   * The site visitor's mobile number.
   */
  mobile?: string;
  /**
   * The site visitor's phone number.
   */
  phone?: string;
  /**
   * The site visitor's postal code.
   */
  postalCode?: string;
  /**
   * The site visitor's state address.
   *
   * Format: title case recommended.
   */
  state?: string;
  /**
   * The site visitor's street address.
   *
   * Format: title case recommended.
   */
  street?: string[];
  /**
   * The site visitor's title.
   *
   * Format: title case.
   */
  title?: string;
  /**
   * Any custom data to collect about an event in addition to the other attributes provided for the event data.
   */
  extensionData?: ExtensionData;
}

/**
 * The JSON array of objects that contain the identity identifiers
 * @public
 */
export interface Identifier {
  /**
   * The date the unique guest (site visitor) identifier expires. This is determined by your organization's identity system.
   *
   * Format: ISO 8601.
   */
  expiryDate?: string;
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
 *  An interface describing the identity event specific payload to be sent to the API
 * @internal
 */
export interface IdentityEventPayload {
  city?: string;
  country?: string;
  dob?: string;
  email?: string;
  firstname?: string;
  gender?: string;
  identifiers: EPIdentifier[];
  lastname?: string;
  mobile?: string;
  phone?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  postal_code?: string;
  state?: string;
  street?: string[];
  title?: string;
  type: 'IDENTITY';
  ext?: FlattenedObject;
}

/**
 * Interface of the unified arguments object for the identity event
 * @internal
 */
export interface IdentityEventArguments {
  sendEvent: SendEvent;
  identityData: IdentityData;
  id: string;
  config: CoreContext['config'];
  infer?: Infer;
}
