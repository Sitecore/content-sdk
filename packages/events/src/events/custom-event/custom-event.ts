import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import type {
  BasicTypes,
  FlattenedObject,
  NestedObject,
} from '@sitecore-content-sdk/analytics-core/utils';
import { flattenObject } from '@sitecore-content-sdk/analytics-core/utils';
import { ERROR_MESSAGES } from '../../consts';
import { BaseEvent } from '../base-event';
import type { EventAttributesInput, ExtensionData } from '../common-interfaces';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import type { SendEvent } from '../send-event/sendEvent';
import { CoreContext } from '@sitecore-content-sdk/core';

/**
 * A class that extends from {@link BaseEvent} and has all the required functionality to send a custom event
 */
export class CustomEvent extends BaseEvent {
  customEventPayload: CustomEventPayload;
  private sendEvent: SendEvent;
  private extensionData: FlattenedObject = {};
  private config: CoreContext['config'];

  /**
   * A class that extends from {@link BaseEvent} and has all the required functionality to send a custom event
   * @param {CustomEventArguments} args - Unified object containing the required properties
   */
  constructor(args: CustomEventArguments) {
    const { channel, currency, language, page, type, extensionData, searchData, ...rest } =
      args.eventData;
    super({ channel, currency, language, page }, args.id);

    this.sendEvent = args.sendEvent;
    this.config = args.config;

    this.customEventPayload = {
      type,
      ...rest,
    };

    if (extensionData) this.extensionData = flattenObject({ object: extensionData });

    const numberOfExtensionDataProperties = Object.entries(this.extensionData).length;

    if (numberOfExtensionDataProperties > MAX_EXT_ATTRIBUTES)
      throw new Error(ERROR_MESSAGES.IV_006);

    if (numberOfExtensionDataProperties > 0) this.customEventPayload.ext = this.extensionData;

    if (searchData)
      this.customEventPayload.sc_search = {
        data: searchData,
        metadata: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ut_api_version: '1.0',
        },
      };
  }

  /**
   * Sends the event to Sitecore Edge Proxy
   * @returns - A promise that resolves with either the Sitecore Edge Proxy response object or null
   */
  async send(): Promise<EPResponse | null> {
    const baseAttr = this.mapBaseEventPayload();
    const fetchBody = Object.assign({}, this.customEventPayload, baseAttr);

    return await this.sendEvent(fetchBody, this.config);
  }
}

/**
 * Interface of the unified arguments object for custom event
 */
export interface CustomEventArguments {
  sendEvent: SendEvent;
  eventData: EventData;
  id: string;
  config: CoreContext['config'];
}

/**
 * Interface with the required/optional attributes to send a custom event to the SitecoreCloud API
 */
export interface CustomEventPayload extends NestedObject {
  sc_search?: {
    data: NestedObject;
    metadata: { ut_api_version: string };
  };
  ext?: {
    [key: string]: BasicTypes;
  };
}

/**
 * Interface with the required/optional attributes to send a custom event to the SitecoreCloud API
 */
export interface EventData extends EventAttributesInput, NestedObject {
  type: string;
  searchData?: NestedObject;
  extensionData?: ExtensionData;
}
