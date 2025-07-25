import {
  ComponentFields,
  ComponentParams,
  ComponentRendering,
  Field,
  GenericFieldValue,
} from '../layout/models';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { normalizeUrl } from '../utils/normalize-url';
import { DesignLibraryMode } from './models';

/**
 * Event to be sent when report status to design library
 */
const DESIGN_LIBRARY_STATUS_EVENT_NAME = 'component:status';

/**
 * Event to send import map to design library
 */
const DESIGN_LIBRARY_IMPORT_MAP_EVENT_NAME = 'component:generation:import-map';

/**
 * Event to send component props to design library
 */
const DESIGN_LIBRARY_COMPONENT_PROPS_EVENT_NAME = 'component:generation:component-props';

/**
 * Event to receive component data from design library
 */
const DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME = 'component:generation:component-preview';

/**
 * Event to send component error to design library
 */
const DESIGN_LIBRARY_COMPONENT_PREVIEW_ERROR_EVENT_NAME =
  'component:generation:component-preview-error';

export interface ImportEntry {
  module: string;
  exports: { name: string | 'default' | '*'; value: unknown }[];
}

/**
 * Represents an event indicating the status of a component in the library.
 */
export interface DesignLibraryStatusEvent {
  name: typeof DESIGN_LIBRARY_STATUS_EVENT_NAME;
  message: {
    status: 'ready' | 'rendered';
    uid: string;
  };
}

/**
 * Represents an event indicating the import map to be sent to design library
 */
export interface DesignLibraryImportMapEvent {
  name: typeof DESIGN_LIBRARY_IMPORT_MAP_EVENT_NAME;
  message: {
    uid: string;
    importMap: {
      module: string;
      exports: string[];
    }[];
  };
}

/**
 * Represents an event indicating the component props to be sent to design library
 */
export interface DesignLibraryComponentPropsEvent {
  name: typeof DESIGN_LIBRARY_COMPONENT_PROPS_EVENT_NAME;
  message: {
    uid: string;
    fields: ComponentFields;
    parameters: ComponentParams;
  };
}

/**
 * Represents an event indicating the preview error to be sent to design library.
 */
export interface DesignLibraryComponentPreviewErrorEvent {
  name: typeof DESIGN_LIBRARY_COMPONENT_PREVIEW_ERROR_EVENT_NAME;
  message: {
    uid: string;
    error: unknown;
    type: DesignLibraryPreviewError;
  };
}

/**
 * Enumeration of error types for the design library preview.
 */
export enum DesignLibraryPreviewError {
  /**
   * Error occurred during component rendering.
   */
  Render = 'render',
  /**
   * Error occurred during component and event handlers initialization.
   */
  RenderInit = 'render-init',
}

/**
 * Enumeration of statuses for the design library.
 */
export enum DesignLibraryStatus {
  READY = 'ready',
  RENDERED = 'rendered',
}

/**
 * Represents a component import.
 */
export type ComponentImport = {
  /**
   * The name of the module to be imported.
   * e.g. 'react'
   */
  module: string;
  /**
   * The name of the export to be imported.
   * e.g. 'useMemo'
   */
  export: string;
  /**
   * The alias of the import.
   * e.g. 'useMemoFn'
   */
  alias: string;
};

/**
 * Represents a component preview event data sent from design library
 */
export interface ComponentPreviewEventArgs {
  name: typeof DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME;
  message: {
    /**
     * The unique identifier for the component.
     */
    uid: string;
    /**
     * The code of the component.
     */
    code: {
      type: 'function';
      content: string;
    };
    /**
     * The styles of the component.
     */
    styles: {
      type: 'style-element';
      /**
       * The styles content to be attached to the DOM.
       */
      content: string;
      /**
       * The CSS module import
       */
      styleImport: {
        /**
         * The name of the style import.
         */
        name: string;
        /**
         * The value of the style import
         */
        content: unknown;
      };
    };
    /**
     * The imports of the component.
     */
    imports: ComponentImport[];
  };
}

/**
 * Event args for Design Library `update` event
 */
export interface ComponentUpdateEventArgs {
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

const validateOrigin = (event: MessageEvent) => {
  // TODO: use `EDITING_ALLOWED_ORIGINS.concat(getAllowedOriginsFromEnv())` later
  // nextjs's JSS_ALLOWED_ORIGINS is not available on the client, need to use NEXT_PUBLIC_ variable, but it's a breaking change for Deploy
  const allowedOrigins = ['*'];
  return allowedOrigins.some(
    (origin) =>
      origin === event.origin ||
      new RegExp('^' + origin.replace('.', '\\.').replace(/\*/g, '.*') + '$').test(event.origin)
  );
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

  const updateComponent = findComponent(rootComponent);

  if (updateComponent) {
    console.debug(
      'Found component with uid %s to update. Update fields: %o. Update params: %o.',
      eventArgs.details.uid,
      eventArgs.details.fields,
      eventArgs.details.params
    );
    if (eventArgs.details.fields) {
      updateComponent.fields = { ...updateComponent.fields, ...eventArgs.details.fields };
    }
    if (eventArgs.details.params) {
      updateComponent.params = { ...updateComponent.params, ...eventArgs.details.params };
    }
    if (successCallback) successCallback(rootComponent);
  } else {
    console.debug('Rendering with uid %s not found', eventArgs.details.uid);
  }
  // strictly for testing
  return rootComponent;
};

/**
 * Builds the component dependencies from the component imports and the import map.
 * @param {ComponentImport[]} componentImports - The component imports.
 * @param {ImportEntry[]} importMap - The import map to be used for the component.
 * @returns {Array<{ name: string; value: unknown }>} The component dependencies.
 */
export function buildComponentDependencies(
  componentImports: ComponentImport[],
  importMap: ImportEntry[]
): Array<{ name: string; value: unknown }> {
  return componentImports.flatMap((componentImport) => {
    const moduleEntry = importMap.find((entry) => entry.module === componentImport.module);

    const exportEntry = moduleEntry?.exports.find((exp) => exp.name === componentImport.export);

    return exportEntry
      ? {
          name: componentImport.alias,
          value: exportEntry.value,
        }
      : [];
  });
}

/**
 * Adds the browser-side event handler for 'component:generation:component-preview' message used in Design Library
 * The event should contain the component code, styles and imports.
 * @param {ImportEntry[]} importMap - The import map to be used for the component.
 * @param {Function} callback callback to be called after component is received
 */
export const addComponentPreviewHandler = (
  importMap: ImportEntry[],
  callback: (error: unknown | null, Component: unknown) => void
) => {
  if (!window) return;

  const handler = (e: MessageEvent) => {
    const eventArgs: ComponentPreviewEventArgs = e.data;

    try {
      if (!e.origin || !eventArgs || eventArgs.name !== 'component:generation:component-preview') {
        // avoid extra noise in logs
        if (!validateOrigin(e)) {
          console.debug(
            'Component Library: event skipped - invalid origin: message %s from origin %s',
            eventArgs.name,
            e.origin
          );
        }

        return;
      }

      console.debug('Component Library: message received', eventArgs);

      const { message } = eventArgs;

      const componentDepencencies = buildComponentDependencies(message.imports, importMap);

      const importNames = componentDepencencies.map((entry) => entry.name);
      const importInstances = componentDepencencies.map((entry) => entry.value);

      // get css file string from message and attach it to DOM
      const style = document.createElement('style');
      style.innerHTML = message.styles.content;
      document.head.appendChild(style);

      const exports: { Component: unknown } = { Component: null };

      const componentFn = new Function(
        'exports',
        message.styles.styleImport.name,
        ...importNames,
        message.code.content
      );

      // Function will set exports.Component
      componentFn(exports, message.styles.styleImport.content, ...importInstances);

      callback(null, exports.Component);
    } catch (error) {
      const errorEvent = getDesignLibraryComponentPreviewErrorEvent(
        eventArgs.message.uid,
        error,
        DesignLibraryPreviewError.RenderInit
      );

      console.error(
        'Component Library: error occurred during event handler initialization',
        errorEvent
      );

      callback(error, null);

      window.parent.postMessage(errorEvent, '*');
    }
  };

  window.addEventListener('message', handler);

  const unsubscribe = () => {
    window.removeEventListener('message', handler);
  };

  return unsubscribe;
};

/**
 * Generates a DesignLibraryComponentPreviewErrorEvent with the given uid and error.
 * @param {string} uid - The unique identifier for the event.
 * @param {unknown} error - The error to be sent.
 * @param {DesignLibraryPreviewError} type - The type of error.
 * @returns An object representing the DesignLibraryComponentPreviewErrorEvent.
 */
export function getDesignLibraryComponentPreviewErrorEvent(
  uid: string,
  error: unknown,
  type: DesignLibraryPreviewError
): DesignLibraryComponentPreviewErrorEvent {
  return {
    name: DESIGN_LIBRARY_COMPONENT_PREVIEW_ERROR_EVENT_NAME,
    message: { uid, error, type },
  };
}

/**
 * Generates a DesignLibraryComponentPropsEvent with the given uid, fields and parameters.
 * @param {string} uid - The unique identifier for the event.
 * @param {ComponentFields} fields - The fields of the component.
 * @param {ComponentParams} parameters - The parameters of the component.
 * @returns An object representing the DesignLibraryComponentPropsEvent.
 */
export function getDesignLibraryComponentPropsEvent(
  uid: string,
  fields: ComponentFields,
  parameters: ComponentParams
): DesignLibraryComponentPropsEvent {
  return {
    name: DESIGN_LIBRARY_COMPONENT_PROPS_EVENT_NAME,
    message: {
      uid,
      fields,
      parameters,
    },
  };
}

/**
 * Generates a DesignLibraryStatusEvent with the given status and uid.
 * @param {DesignLibraryStatus} status - The status of rendering.
 * @param {string} uid - The unique identifier for the event.
 * @returns An object representing the DesignLibraryStatusEvent.
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
 * Generates a DesignLibraryImportMapEvent with the given uid and importMap.
 * @param {string} uid - The unique identifier for the event.
 * @param {ImportEntry[]} importMap - The imports map to be sent.
 * @returns An object representing the DesignLibraryImportMapEvent.
 */
export function getDesignLibraryImportMapEvent(
  uid: string,
  importMap: ImportEntry[]
): DesignLibraryImportMapEvent {
  const importMapPayload = importMap.map((entry) => ({
    module: entry.module,
    exports: entry.exports.map((exp) => exp.name),
  }));

  return {
    name: DESIGN_LIBRARY_IMPORT_MAP_EVENT_NAME,
    message: {
      uid,
      importMap: importMapPayload,
    },
  };
}

/**
 * Generates the URL for the design library script link.
 * @param {string} [sitecoreEdgeUrl] Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io
 * @returns The full URL to the design library script.
 */
export function getDesignLibraryScriptLink(sitecoreEdgeUrl = SITECORE_EDGE_URL_DEFAULT): string {
  return `${normalizeUrl(sitecoreEdgeUrl)}/v1/files/designlibrary/lib/rh-lib-script.js`;
}

/**
 * Checks if the given mode is a Design Library mode.
 * @param {unknown} mode - The mode to check.
 * @returns {boolean} True if the mode is a Design Library mode, false otherwise.
 */
export function isDesignLibraryMode(mode: unknown): mode is DesignLibraryMode {
  return (
    mode === DesignLibraryMode.Normal ||
    mode === DesignLibraryMode.Metadata ||
    mode === DesignLibraryMode.VariantGeneration
  );
}
