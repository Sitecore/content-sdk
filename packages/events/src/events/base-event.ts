import { language, pageName } from '@sitecore-content-sdk/analytics-core/internal';
import type { EventAttributesInput } from './common-interfaces';

export class BaseEvent {
  public page: string;
  private readonly clientId: string;
  private readonly language: string | undefined;
  /**
   * The base event class that has all the shared functions between Events
   * @param {BaseEventData} baseEventData - The event data to send
   * @param {string} id - The client id
   */
  constructor(private baseEventData: BaseEventData, id: string) {
    this.clientId = id;
    this.language = this.baseEventData.language ?? language();
    this.page = this.baseEventData.page ?? pageName();
  }

  /**
   *  A function that returns the properties for sending events to the Sitecore Edge Proxy.
   * @returns an object that is required
   */
  protected mapBaseEventPayload(): BasePayload {
    return {
      client_id: this.clientId,
      channel: this.baseEventData.channel,
      client_key: '',
      currency: this.baseEventData.currency,
      language: this.language,
      page: this.page,
      pos: '',
      requested_at: new Date().toISOString(),
    };
  }
}

/**
 *  An interface describing the basic payload to be sent to the API
 * @internal
 */
export interface BasePayload {
  client_id: string;
  channel?: string;
  client_key: string;
  currency?: string;
  language?: string;
  page?: string;
  pos: string;
  requested_at: string;
}

type BaseEventData = EventAttributesInput;
