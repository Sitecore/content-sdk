import { ComponentFields, ComponentParams } from '../../layout/models';
import { validateEvent, DesignLibraryEvent } from '../design-library';

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
 * Represents a component preview event data sent from design library
 * @internal
 */
export interface ComponentPreviewEventArgs extends DesignLibraryEvent {
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
 * Represents an event indicating the import map to be sent to design library
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
 */
export interface DesignLibraryComponentPreviewErrorEvent extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_COMPONENT_PREVIEW_ERROR_EVENT_NAME;
  message: {
    uid: string;
    error: unknown;
    type: DesignLibraryPreviewError;
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
}

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

      const Component = createComponentInstance(importMap, eventArgs);
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
 * The event should contain the component code, styles and imports.
 * @param {Function} callback callback to be called after component is received
 * @internal
 */
export const addServerComponentPreviewHandler = (
  callback: (eventArgs: ComponentPreviewEventArgs) => void
) => {
  const handler = (e: MessageEvent) => {
    if (!validateEvent(e, DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME)) {
      return;
    }

    console.debug('Component Library: message received', e.data);

    callback(e.data as ComponentPreviewEventArgs);
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
 * @param {ComponentPreviewEventArgs} previewEventArgs - The event arguments containing the component code, styles, and import definitions.
 * @returns The dynamically created React component instance.
 * @throws If any required modules or exports are missing from the import map, an error is thrown describing the missing dependencies.
 * @internal
 */
export const createComponentInstance = (
  importMap: ImportEntry[],
  previewEventArgs: ComponentPreviewEventArgs
): unknown => {
  const { message } = previewEventArgs;
  const dependencies = buildComponentDependencies(message.imports, importMap);

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
    message.styles.styleImport.name,
    ...importNames,
    message.code.content
  );

  // Function will set exports.Component
  componentFn(exports, message.styles.styleImport.content, ...importInstances);

  return exports.Component;
};

/**
 * Generates a DesignLibraryComponentPreviewErrorEvent with the given uid and error.
 * @param {string} uid - The unique identifier for the event.
 * @param {unknown} error - The error to be sent.
 * @param {DesignLibraryPreviewError} type - The type of error.
 * @returns An object representing the DesignLibraryComponentPreviewErrorEvent.
 * @internal
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
 * @internal
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
 * Sends a component preview error event to the design library
 * @param {string} uid - The unique identifier of the component that's being edited.
 * @param {unknown} error - The error object or message to be sent.
 * @param {DesignLibraryPreviewError} type - The type of error, as defined in DesignLibraryPreviewError.
 * @internal
 */
export const sendErrorEvent = (uid: string, error: unknown, type: DesignLibraryPreviewError) => {
  const errorEvent = getDesignLibraryComponentPreviewErrorEvent(uid, error, type);
  console.error('Component Library: sending error event', errorEvent);
  if (typeof window !== 'undefined') {
    const target = window.parent && window.parent !== window ? window.parent : window;
    target.postMessage(errorEvent, '*');
  }
};
