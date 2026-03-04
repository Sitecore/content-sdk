import { NativeDataFetcher, constants } from '@sitecore-content-sdk/core';
import { ComponentFields, ComponentParams } from '../../layout/models';
import { validateEvent, DesignLibraryEvent } from '../design-library';
import debug from '../../debug';

const { SITECORE_EDGE_PLATFORM_URL_DEFAULT } = constants;

const { ERROR_MESSAGES } = constants;

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
 * Event to send component preview error to design library
 */
const DESIGN_LIBRARY_COMPONENT_PREVIEW_ERROR_EVENT_NAME =
  'component:generation:component-preview-error';

/**
 * Event to send general component preview error to design library
 */
const DESIGN_LIBRARY_ERROR_EVENT_NAME = 'component:generation:error';

/**
 * Represents an import map entry.
 * @public
 */
export interface ImportEntry {
  module: string;
  exports: { name: string | 'default' | '*'; value: unknown }[];
}

/**
 * Represents the info for the import entry to be sent to design library.
 * @internal
 */
export interface ImportEntryInfo {
  module: string;
  exports: string[];
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
 * Represents the data needed to render AI generated component.
 * @internal
 */
export type GeneratedComponentData = {
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

/**
 * Represents a component preview event data sent from design library
 * @internal
 */
export interface ComponentPreviewEventArgs extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME;
  message: GeneratedComponentData;
}

/**
 * Represents a server component preview event data sent from design library in variant generation mode.
 * @internal
 */
export interface ServerComponentPreviewEventArgs extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME;
  message: {
    /**
     * The cache information for the component preview, used for server components in Design Library variant generation mode.
     */
    cache: {
      /** The unique identifier for the cache entry. */
      id: string;
      /** The jwt token for authentication when fetching the preview component from the cache. */
      token: string;
    };
  };
}

/**
 * Represents an event indicating the import map to be sent to design library
 * @internal
 */
export interface DesignLibraryImportMapEvent extends DesignLibraryEvent {
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
 * @internal
 */
export interface DesignLibraryComponentPropsEvent extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_COMPONENT_PROPS_EVENT_NAME;
  message: {
    uid: string;
    fields: ComponentFields;
    parameters: ComponentParams;
  };
}

/**
 * Represents an event indicating the preview error to be sent to design library.
 * Sending this type of event will trigger attempt regenerate the component by design library and resend the preview event.
 * @internal
 */
export interface DesignLibraryComponentPreviewErrorEvent extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_COMPONENT_PREVIEW_ERROR_EVENT_NAME;
  message: {
    uid: string;
    error: unknown;
    type: DesignLibraryPreviewError.Render | DesignLibraryPreviewError.RenderInit;
  };
}

/**
 * Represents an event indicating a general error to be sent to design library.
 * @internal
 */
export interface DesignLibraryErrorEvent extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_ERROR_EVENT_NAME;
  message: {
    uid: string;
    error: unknown;
    type: Omit<
      DesignLibraryPreviewError,
      DesignLibraryPreviewError.Render | DesignLibraryPreviewError.RenderInit
    >;
  };
}

/**
 * Enumeration of error types for the design library preview.
 * @internal
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
  /**
   * The import map is missing
   */
  ImportMapMissing = 'import-map-missing',
  /**
   * Error during loading of the import map
   */
  ImportMapLoad = 'import-map-load-error',
  /**
   * Error during fetching the generated component data from secured endpoint
   */
  GeneratedComponentFetch = 'generated-component-fetch-error',
}

/**
 * The generated component data response from the secured endpoint
 * @internal
 */
type GeneratedComponentDataResponse = {
  /**
   * The unique identifier for the cache entry.
   */
  id: string;
  /**
   * The component data content in string format, which includes the component code, styles and imports.
   */
  content: string;
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
) {
  const successful: Array<{ name: string; value: unknown }> = [];
  const missing: {
    modules: {
      module: string;
      alias: string;
    }[];
    exports: {
      alias: string;
      export: string;
      module: string;
    }[];
  } = {
    modules: [],
    exports: [],
  };

  componentImports.forEach((componentImport) => {
    const moduleEntry = importMap.find((entry) => entry.module === componentImport.module);

    if (!moduleEntry) {
      missing.modules.push({
        module: componentImport.module,
        alias: componentImport.alias,
      });

      return;
    }

    const exportEntry = moduleEntry.exports.find((exp) => exp.name === componentImport.export);

    if (!exportEntry) {
      missing.exports.push({
        alias: componentImport.alias,
        export: componentImport.export,
        module: componentImport.module,
      });

      return;
    }

    return successful.push({
      name: componentImport.alias,
      value: exportEntry.value,
    });
  });

  return {
    successful,
    missing,
  };
}

/**
 * Adds the browser-side event handler for 'component:generation:component-preview' message used in Design Library
 * The event should contain the component code, styles and imports.
 * @param {ImportEntry[]} importMap - The import map to be used for the component.
 * @param {Function} callback callback to be called after component is received
 * @internal
 */
export const addComponentPreviewHandler = (
  importMap: ImportEntry[],
  callback: (error: unknown | null, Component: unknown) => void
) => {
  if (!window) return;

  const handler = (e: MessageEvent) => {
    const eventArgs: ComponentPreviewEventArgs = e.data;

    try {
      if (!validateEvent(e, DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME)) {
        return;
      }

      console.debug('Component Library: message received', eventArgs);

      const Component = createComponentInstance(importMap, eventArgs.message);
      addStyleElement(eventArgs.message.styles.content);

      callback(null, Component);
    } catch (error) {
      sendErrorEvent(eventArgs.message.uid, error, DesignLibraryPreviewError.RenderInit);
      callback(error, null);
    }
  };

  window.addEventListener('message', handler);

  const unsubscribe = () => {
    window.removeEventListener('message', handler);
  };

  return unsubscribe;
};

/**
 * Adds the browser-side event handler for 'component:generation:component-preview' message used in Design Library for server components
 * The event should contain the cache id and token which will be used to fetch the component code, styles and imports from secured endpoint
 * @param {Function} callback callback to be called after component is received
 * @internal
 */
export const addServerComponentPreviewHandler = (
  callback: (eventArgs: ServerComponentPreviewEventArgs) => void
) => {
  const handler = (e: MessageEvent) => {
    if (!validateEvent(e, DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME)) {
      return;
    }

    console.debug('Component Library: message received', e.data);

    callback(e.data as ServerComponentPreviewEventArgs);
  };

  window.addEventListener('message', handler);

  const unsubscribe = () => {
    window.removeEventListener('message', handler);
  };

  return unsubscribe;
};

/**
 * Adds <style> element in the document head with the provided CSS.
 * If an existing style element with the id "content-sdk-style-preview" is found, it is removed
 * to prevent duplicates
 * @param {string} stylesContent - The raw CSS text to inject into the style element.
 * @internal
 */
export function addStyleElement(stylesContent: string) {
  const styleId = 'content-sdk-style-preview';
  const styleElement = document.getElementById(styleId);

  // remove existing style element if it exists to avoid duplicates
  if (styleElement) {
    styleElement.remove();
  }

  // create new style element and attach it to DOM
  const style = document.createElement('style');
  style.setAttribute('id', styleId);
  style.innerHTML = stylesContent;
  document.head.appendChild(style);
}

/**
 * Dynamically creates a React component instance from provided importMap and from code, styles, and dependencies provided in the preview event.
 * @param {ImportEntry[]} importMap - The import map containing module and export references that might be injected as dependencies in the provided code.
 * @param {GeneratedComponentData} generatedComponentData - The generated component data received from design library.
 * @returns The dynamically created React component instance.
 * @throws If any required modules or exports are missing from the import map, an error is thrown describing the missing dependencies.
 * @internal
 */
export const createComponentInstance = (
  importMap: ImportEntry[],
  generatedComponentData: GeneratedComponentData
): unknown => {
  const dependencies = buildComponentDependencies(generatedComponentData.imports, importMap);

  if (dependencies.missing.modules.length > 0 || dependencies.missing.exports.length > 0) {
    let errorMessage = '';

    dependencies.missing.modules.forEach((mod) => {
      errorMessage += `Missing module: '${mod.module}' with alias: '${mod.alias}'\n`;
    });

    dependencies.missing.exports.forEach((exp) => {
      const alias = exp.export !== exp.alias ? ` with alias: '${exp.alias}'` : '';
      errorMessage += `Missing export: '${exp.export}' from module: '${exp.module}'${alias}\n`;
    });

    throw errorMessage;
  }

  const importNames = dependencies.successful.map((entry) => entry.name);
  const importInstances = dependencies.successful.map((entry) => entry.value);

  const exports: { Component: unknown } = { Component: null };
  const componentFn = new Function(
    'exports',
    generatedComponentData.styles.styleImport.name,
    ...importNames,
    generatedComponentData.code.content
  );

  // Function will set exports.Component
  componentFn(exports, generatedComponentData.styles.styleImport.content, ...importInstances);

  return exports.Component;
};

/**
 * Generates a DesignLibraryErrorEvent depending on the type of error with the given uid and error.
 * @param {string} uid - The unique identifier for the event.
 * @param {unknown} error - The error to be sent.
 * @param {DesignLibraryPreviewError} type - The type of error.
 * @returns An object representing the DesignLibraryErrorEvent.
 * @internal
 */
export function getDesignLibraryErrorEvent(
  uid: string,
  error: unknown,
  type: DesignLibraryPreviewError
): DesignLibraryErrorEvent | DesignLibraryComponentPreviewErrorEvent {
  switch (type) {
    case DesignLibraryPreviewError.Render:
    case DesignLibraryPreviewError.RenderInit:
      return {
        name: DESIGN_LIBRARY_COMPONENT_PREVIEW_ERROR_EVENT_NAME,
        message: { uid, error, type },
      };
    default:
      return {
        name: DESIGN_LIBRARY_ERROR_EVENT_NAME,
        message: { uid, error, type },
      };
  }
}

/**
 * Generates a DesignLibraryComponentPropsEvent with the given uid, fields and parameters.
 * @param {string} uid - The unique identifier for the event.
 * @param {ComponentFields} fields - The fields of the component.
 * @param {ComponentParams} parameters - The parameters of the component.
 * @returns An object representing the DesignLibraryComponentPropsEvent.
 * @internal
 */
export function getDesignLibraryComponentPropsEvent(
  uid: string,
  fields: ComponentFields = {},
  parameters: ComponentParams = {}
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
 * Generates a DesignLibraryImportMapEvent with the given uid and importMap.
 * @param {string} uid - The unique identifier for the event.
 * @param {ImportEntry[]} importMap - The imports map to be sent.
 * @returns An object representing the DesignLibraryImportMapEvent.
 * @internal
 */
export function getDesignLibraryImportMapEvent(
  uid: string,
  importMap: ImportEntry[] | ImportEntryInfo[]
): DesignLibraryImportMapEvent {
  const importMapPayload = isImportEntryInfoArray(importMap)
    ? importMap
    : getImportMapInfo(importMap);

  return {
    name: DESIGN_LIBRARY_IMPORT_MAP_EVENT_NAME,
    message: {
      uid,
      importMap: importMapPayload,
    },
  };
}

/**
 * Generates the payload for the import map to be sent to design library.
 * @param {ImportEntry[]} importMap - The imports map to be sent.
 * @internal
 */
export function getImportMapInfo(importMap: ImportEntry[]): ImportEntryInfo[] {
  return importMap.map((entry) => ({
    module: entry.module,
    exports: entry.exports.map((exp) => exp.name),
  }));
}

/**
 * Type guard for ImportEntryInfo[]
 * @param {unknown} data import entry data to check
 * @returns true if the data is ImportEntryInfo array
 */
export function isImportEntryInfoArray(data: unknown): data is ImportEntryInfo[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0].module === 'string' &&
    Array.isArray(data[0].exports) &&
    typeof data[0].exports[0] === 'string'
  );
}

/**
 * Sends a design library error event to the design library
 * @param {string} uid - The unique identifier of the component that's being edited.
 * @param {unknown} error - The error object or message to be sent.
 * @param {DesignLibraryPreviewError} type - The type of error, as defined in DesignLibraryPreviewError.
 * @internal
 */
export const sendErrorEvent = (uid: string, error: unknown, type: DesignLibraryPreviewError) => {
  const errorEvent = getDesignLibraryErrorEvent(uid, error, type);
  console.error('Component Library: sending error event', errorEvent);
  if (typeof window !== 'undefined') {
    const target = window.parent && window.parent !== window ? window.parent : window;
    target.postMessage(errorEvent, '*');
  }
};

/**
 * Fetches generated component data from the authoring cache endpoint.
 * This is used by the Design Studio Server to fetch the updated component data from the secured cache endpoint and render it in the Design Library Studio preview iframe.
 * @param {string} id - The unique identifier of the component to fetch from cache.
 * @param {string} token - The authorization token for authentication.
 * @param {string} [edgeUrl] - The URL of the Sitecore Edge endpoint.
 * @returns A Promise that resolves to the component rendering data, component generation data, or undefined if the fetch fails.
 * @internal
 */
export async function fetchGeneratedComponentFromCache(
  id: string,
  token: string,
  edgeUrl: string = SITECORE_EDGE_PLATFORM_URL_DEFAULT
): Promise<GeneratedComponentData> {
  const dataFetcher = new NativeDataFetcher({ debugger: debug.editing });

  const componentDataResponse = await dataFetcher.fetch<GeneratedComponentDataResponse>(
    `${edgeUrl}/authoring/api/v1/components/cache/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (componentDataResponse.status !== 200) {
    throw new Error(
      `Failed to fetch generated component data from cache for id: ${id}. Response Status: ${componentDataResponse.status}, Response Status Text: ${componentDataResponse.statusText}`
    );
  }

  const generatedComponentData = JSON.parse(
    componentDataResponse.data.content
  ) as GeneratedComponentData;

  return generatedComponentData;
}
