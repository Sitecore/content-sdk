import { ComponentFields, ComponentParams } from '../../layout/models';
import { validateOrigin } from '../design-library';

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
 */
export interface ImportEntry {
  module: string;
  exports: { name: string | 'default' | '*'; value: unknown }[];
}

/**
 * Represents the payload for the import entry to be sent to design library.
 */
export interface ImportEntryPayload {
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

      const styleId = 'content-sdk-style-preview';
      const styleElement = document.getElementById(styleId);

      // remove existing style element if it exists to avoid duplicates
      if (styleElement) {
        styleElement.remove();
      }

      // create new style element and attach it to DOM
      const style = document.createElement('style');
      style.setAttribute('id', styleId);
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

      console.error('Component Library: sending error event', errorEvent);

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

export const addServerComponentPreviewHandler = (
  callback: (eventArgs: ComponentPreviewEventArgs) => void
) => {
  const handler = (e: MessageEvent) => {
    if (!e.origin || !e.data || e.data.name !== 'component:generation:component-preview') {
      // avoid extra noise in logs
      if (!validateOrigin(e)) {
        console.debug(
          'Component Library: event skipped - invalid origin: message %s from origin %s',
          e.data.name,
          e.origin
        );
      }

      return;
    }

    callback(e.data as ComponentPreviewEventArgs);
  };

  window.addEventListener('message', handler);

  const unsubscribe = () => {
    window.removeEventListener('message', handler);
  };

  return unsubscribe;
};

export const createComponent = (
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
 * Generates a DesignLibraryImportMapEvent with the given uid and importMap.
 * @param {string} uid - The unique identifier for the event.
 * @param {ImportEntry[]} importMap - The imports map to be sent.
 * @returns An object representing the DesignLibraryImportMapEvent.
 */
export function getDesignLibraryImportMapEvent(
  uid: string,
  importMap: ImportEntry[]
): DesignLibraryImportMapEvent {
  const importMapPayload = getImportMapPayload(importMap);

  return {
    name: DESIGN_LIBRARY_IMPORT_MAP_EVENT_NAME,
    message: {
      uid,
      importMap: importMapPayload,
    },
  };
}

export function getDesignLibraryImportMapPayloadEvent(
  uid: string,
  importMap: ImportEntryPayload[]
): DesignLibraryImportMapEvent {
  return {
    name: DESIGN_LIBRARY_IMPORT_MAP_EVENT_NAME,
    message: {
      uid,
      importMap: importMap,
    },
  };
}

/**
 * Generates the payload for the import map to be sent to design library.
 * @param {ImportEntry[]} importMap - The imports map to be sent.
 */
export function getImportMapPayload(importMap: ImportEntry[]): ImportEntryPayload[] {
  return importMap.map((entry) => ({
    module: entry.module,
    exports: entry.exports.map((exp) => exp.name),
  }));
}
