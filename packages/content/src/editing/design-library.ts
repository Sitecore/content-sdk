import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl } from '@sitecore-content-sdk/core/tools';
import {
  ComponentFields,
  ComponentParams,
  ComponentRendering,
  Field,
  GenericFieldValue,
} from '../layout/models';
import { DesignLibraryMode } from './models';

const { SITECORE_EDGE_URL_DEFAULT } = constants;

/**
 * Event to be sent when report status to design library
 */
const DESIGN_LIBRARY_STATUS_EVENT_NAME = 'component:status';

/**
 * Prefix for component update cache keys
 * @internal
 */
export const COMPONENT_UPDATE_CACHE_KEY_PREFIX = 'component-update-';

/**
 * Base interface for all Design Library events.
 */
export interface DesignLibraryEvent {
  /**
   * The name of the event.
   */
  name: string;
  /**
   * The message payload for the event.
   */
  message: Record<string, unknown>;
}

/**
 * Represents an event indicating the status of a component in the library.
 * @internal
 */
export interface DesignLibraryStatusEvent extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_STATUS_EVENT_NAME;
  message: {
    status: 'ready' | 'rendered';
    uid: string;
  };
}

/**
 * Enumeration of statuses for the design library.
 * @internal
 */
export enum DesignLibraryStatus {
  READY = 'ready',
  RENDERED = 'rendered',
}

/**
 * Event args for Design Library `update` event
 * @internal
 */
export interface ComponentUpdateEventArgs extends DesignLibraryEvent {
  name: string;
  details?: {
    uid: string;
    params?: Record<string, string>;
    fields?: Record<string, Field<GenericFieldValue>>;
  };
}

/**
 * Adds the browser-side event handler for 'component:update' message used in Design Library
 * The event should update a component on page by uid, with fields and params from event args
 * @param {ComponentRendering} rootComponent root component displayed for Design Library page
 * @param {Function} successCallback  callback to be called after successful component update
 * @internal
 */
export const addComponentUpdateHandler = (
  rootComponent: ComponentRendering,
  successCallback?: (updatedRootComponent: ComponentRendering) => void
) => {
  if (!window) return;
  const handler = (e: MessageEvent) => updateComponentHandler(e, rootComponent, successCallback);
  window.addEventListener('message', handler);
  // the power to remove handler outside of this function, if needed
  const unsubscribe = () => {
    window.removeEventListener('message', handler);
  };
  return unsubscribe;
};

export const validateOrigin = (event: MessageEvent) => {
  // TODO: use `EDITING_ALLOWED_ORIGINS.concat(getAllowedOriginsFromEnv())` later
  // nextjs's JSS_ALLOWED_ORIGINS is not available on the client, need to use NEXT_PUBLIC_ variable, but it's a breaking change for Deploy
  const allowedOrigins = ['*'];
  return allowedOrigins.some(
    (origin) =>
      origin === event.origin ||
      new RegExp('^' + origin.replace('.', '\\.').replace(/\*/g, '.*') + '$').test(event.origin)
  );
};

/**
 * Validates that a MessageEvent has the expected event name and required data.
 * Logs debug information when validation fails due to invalid origin.
 * @param {MessageEvent} e - The message event to validate.
 * @param {string} eventName - The expected event name to match against e.data.name.
 * @returns {boolean} True if the event has a valid origin, data object, and matching event name; otherwise false.
 */
export const validateEvent = (e: MessageEvent, eventName: string): boolean => {
  if (!e.origin || !e.data || e.data.name !== eventName) {
    // avoid extra noise in logs
    if (!validateOrigin(e)) {
      console.debug(
        'Component Library: event skipped - invalid origin: message %s from origin %s',
        e.data.name,
        e.origin
      );
    }

    return false;
  }

  return true;
};

export const updateComponentHandler = (
  e: MessageEvent,
  rootComponent: ComponentRendering,
  successCallback?: (updatedRootComponent: ComponentRendering) => void
) => {
  const eventArgs: ComponentUpdateEventArgs = e.data;
  if (!e.origin || !eventArgs || eventArgs.name !== 'component:update') {
    // avoid extra noise in logs
    if (!validateOrigin(e)) {
      console.debug(
        'Component Library: event skipped: message %s from origin %s',
        eventArgs.name,
        e.origin
      );
    }
    return;
  }
  if (!eventArgs.details?.uid) {
    console.debug('Received component:update event without uid, aborting event handler...');
    return;
  }

  const findComponent = (root: ComponentRendering): ComponentRendering | null => {
    if (root.uid?.toLowerCase() === eventArgs.details?.uid.toLowerCase()) return root;
    if (root.placeholders) {
      for (const plhName of Object.keys(root.placeholders)) {
        for (const rendering of root.placeholders![plhName]) {
          const result = findComponent(rendering as ComponentRendering);
          if (result) return result;
        }
      }
    }
    return null;
  };

  const componentToUpdate = findComponent(rootComponent);

  if (componentToUpdate) {
    console.debug(
      'Found component with uid %s to update. Update fields: %o. Update params: %o.',
      eventArgs.details.uid,
      eventArgs.details.fields,
      eventArgs.details.params
    );

    updateComponent(componentToUpdate, eventArgs.details.fields, eventArgs.details.params);

    if (successCallback) successCallback(rootComponent);
  } else {
    console.debug('Rendering with uid %s not found', eventArgs.details.uid);
  }
  // strictly for testing
  return rootComponent;
};

/**
 * Updates a component's fields and params with the provided values.
 * @param {ComponentRendering<ComponentFields>} component - The component to update.
 * @param {ComponentFields | undefined} fields - The fields to merge into the component.
 * @param {ComponentParams | undefined} params - The params to merge into the component.
 * @internal
 */
export const updateComponent = (
  component: ComponentRendering<ComponentFields>,
  fields: ComponentFields | undefined,
  params: ComponentParams | undefined
) => {
  if (fields) {
    component.fields = { ...component.fields, ...fields };
  }
  if (params) {
    component.params = { ...component.params, ...params };
  }
};

/**
 * Generates a DesignLibraryStatusEvent with the given status and uid.
 * @param {DesignLibraryStatus} status - The status of rendering.
 * @param {string} uid - The unique identifier for the event.
 * @returns An object representing the DesignLibraryStatusEvent.
 * @internal
 */
export function getDesignLibraryStatusEvent(
  status: DesignLibraryStatus,
  uid: string
): DesignLibraryStatusEvent {
  return {
    name: DESIGN_LIBRARY_STATUS_EVENT_NAME,
    message: {
      status,
      uid,
    },
  };
}

/**
 * Generates the URL for the design library script link.
 * @param {string} [sitecoreEdgeUrl] Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io
 * @returns The full URL to the design library script.
 * @internal
 */
export function getDesignLibraryScriptLink(sitecoreEdgeUrl = SITECORE_EDGE_URL_DEFAULT): string {
  return `${normalizeUrl(sitecoreEdgeUrl)}/v1/files/designlibrary/lib/rh-lib-script.js`;
}

/**
 * Checks if the given mode is a Design Library mode.
 * @param {unknown} mode - The mode to check.
 * @returns {boolean} True if the mode is a Design Library mode, false otherwise.
 * @internal
 */
export function isDesignLibraryMode(mode: unknown): mode is DesignLibraryMode {
  return mode === DesignLibraryMode.Normal || mode === DesignLibraryMode.Metadata;
}

/**
 * Sends an event to the Design Library
 * @param {DesignLibraryEvent} evt - The event object to send.
 * @internal
 */
export const postToDesignLibrary = (evt: DesignLibraryEvent) => {
  if (typeof window === 'undefined') return;

  const target = window.parent && window.parent !== window ? window.parent : window;

  try {
    console.log('Component Library: sending event', evt.name, evt);
    target.postMessage(evt, '*');
  } catch (err) {
    console.error('Component Library: postMessage failed', err, evt);
  }
};
