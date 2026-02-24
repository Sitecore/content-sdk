import type { EPResponse, Infer } from '@sitecore-content-sdk/analytics-core/internal';
import type { EventAttributesInput, ExtensionData } from '../common-interfaces';
import type { FlattenedObject, NestedObject } from '@sitecore-content-sdk/analytics-core/utils';
import { MAX_EXT_ATTRIBUTES, UTM_PREFIX } from '../consts';
import { BaseEvent } from '../base-event';
import type { SendEvent } from '../send-event/sendEvent';
import { flattenObject } from '@sitecore-content-sdk/analytics-core/utils';
import { CoreContext, constants } from '@sitecore-content-sdk/core';

const { ERROR_MESSAGES } = constants;

/**
 * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
 */
export class PageViewEvent extends BaseEvent {
  static isFirstPageView = true;
  config: CoreContext['config'];
  private sendEvent: SendEvent;
  private pageViewData?: PageViewData;
  private extensionData: FlattenedObject = {};
  private urlSearchParams: URLSearchParams;
  private includeUTMParameters: boolean;

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a VIEW event
   * @param {PageViewEventArguments} args - Unified object containing the required properties
   */
  constructor(args: PageViewEventArguments) {
    const { channel, currency, language, page, extensionData } = { ...args.pageViewData };
    super(
      {
        channel,
        currency,
        language,
        page,
      },
      args.id
    );

    this.pageViewData = args.pageViewData;
    this.sendEvent = args.sendEvent;
    this.config = args.config;
    this.urlSearchParams = new URLSearchParams(decodeURI(args.searchParams));

    if (extensionData) this.extensionData = flattenObject({ object: extensionData });
    const numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES)
      throw new Error(ERROR_MESSAGES.IV_006(MAX_EXT_ATTRIBUTES));

    this.includeUTMParameters =
      (args.pageViewData && args.pageViewData.includeUTMParameters) ?? true;
  }

  /**
   * Sends the event to Sitecore Edge Proxy
   * @returns - A promise that resolves with either the Sitecore Edge Proxy response object or null
   */
  async send(): Promise<EPResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const eventAttrs = this.mapAttributes();

    PageViewEvent.isFirstPageView = false;

    return await this.sendEvent({ ...baseAttr, ...eventAttrs }, this.config);
  }

  /**
   * Gets the variant ID from the url if not passed by the developer
   * Gets the variant ID from the extension data if not found from the url
   * @param {string} [pageVariantIdFromPageViewData] - The variant ID from the page view data
   * @param {string} [pageVariantIdFromExt] - The variant ID from extension data
   * @returns - variant ID or null
   */
  private getPageVariantId(pageVariantIdFromPageViewData?: string, pageVariantIdFromExt?: string) {
    if (pageVariantIdFromPageViewData) return pageVariantIdFromPageViewData;

    const pageVariantIdFromURL = this.urlSearchParams.get('variantid');

    if (pageVariantIdFromURL) return pageVariantIdFromURL;
    if (pageVariantIdFromExt) return pageVariantIdFromExt;

    return null;
  }

  /**
   * Returns the referrer if exists on page view event else null if on server and no referrer is on event, else
   * returns the href if on client side and the document referrer is different from the window location hostname
   * @returns - the referrer
   */
  private getReferrer() {
    if (this.pageViewData?.referrer) return this.pageViewData.referrer;
    if (typeof window === 'undefined') return null;

    if (!PageViewEvent.isFirstPageView || !document.referrer) return null;

    const { hostname, href } = new URL(document.referrer);

    return window.location.hostname !== hostname ? href : null;
  }

  /**
   * Maps parameters given as input to corresponding attributes send to the API
   * @returns the mapped object to be sent as payload
   */
  private mapAttributes(): PageViewEventPayload {
    let pageViewPayload: PageViewEventPayload = {
      type: 'VIEW',
    };

    const pageVariantId =
      this.pageViewData &&
      this.getPageVariantId(
        this.pageViewData.pageVariantId,
        this.extensionData.pageVariantId as string
      );

    if (pageVariantId !== null) pageViewPayload.ext = { ...pageViewPayload.ext, pageVariantId };

    if (Object.keys(this.extensionData).length > 0) {
      delete this.extensionData.pageVariantId;

      pageViewPayload.ext = { ...pageViewPayload.ext, ...this.extensionData };
    }

    if (this.includeUTMParameters) {
      const utmParameters = this.getUTMParameters();
      pageViewPayload = { ...pageViewPayload, ...utmParameters };
    }

    const referrer = this.getReferrer();

    if (referrer !== null) pageViewPayload = { ...pageViewPayload, referrer };

    if (this.pageViewData?.searchData)
      pageViewPayload.sc_search = {
        data: this.pageViewData.searchData,
        metadata: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ut_api_version: '1.0',
        },
      };

    return pageViewPayload;
  }

  /**
   * Retrieves UTM parameters from the url query string
   * @returns - an object containing the UTM parameters if they exist
   */
  private getUTMParameters() {
    const utmParameters: UtmParameters = {};

    this.urlSearchParams.forEach((value: string, key: string) => {
      const param = key.toLowerCase();

      if (param.indexOf(UTM_PREFIX) === 0) utmParameters[param as keyof UtmParameters] = value;
    });

    return utmParameters;
  }
}

/**
 * Interface of the unified arguments object for page view event
 * @internal
 */
export interface PageViewEventArguments {
  sendEvent: SendEvent;
  pageViewData?: PageViewData;
  id: string;
  config: CoreContext['config'];
  infer?: Infer;
  extensionData?: NestedObject;
  searchParams: string;
}

/**
 * Type with the required/optional attributes in order to send a view event to the SitecoreCloud API
 * @public
 */
export interface PageViewData extends EventAttributesInput {
  /**
   * The ID of a personalized page variant.
   */
  pageVariantId?: string;
  /**
   * The URI of the webpage that linked to the webpage where the event was captured.
   *
   * Default for browser-side events: inferred from document.referrer. If document.referrer is an empty string, the value will be set to null.
   *
   * Default for server-side events: null.
   */
  referrer?: string;
  /**
   * Whether to add every UTM parameter from the URL of the current webpage to the event object.
   *
   * Default: `true`.
   */
  includeUTMParameters?: boolean;
  /**
   * Any custom data to collect about an event in addition to the other attributes provided for the event data.
   */
  extensionData?: ExtensionData;
  /**
   * Sitecore Search data about the event.
   * If set, the event and all its data will be available in Sitecore Search.
   * Construct according to the Sitecore Search Events API reference and data model.
   */
  searchData?: NestedObject;
}

/**
 * Interface with the utm_ parameters
 * @internal
 */
interface UtmParameters {
  [key: `utm_${string}`]: string;
}

/**
 * An interface describing the page view event specific payload to be sent to the API
 * @internal
 */
export interface PageViewEventPayload extends UtmParameters {
  type: 'VIEW';
  referrer?: string;
  ext?: { pageVariantId?: string } & FlattenedObject;
  sc_search?: {
    data: NestedObject;
    metadata: { ut_api_version: string };
  };
}
