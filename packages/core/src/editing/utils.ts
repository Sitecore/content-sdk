import { Field, GenericFieldValue } from '../layout/models';
import isServer from '../utils/is-server';

/**
 * Default value of uid for root placeholder when uid is not present.
 */
export const DEFAULT_PLACEHOLDER_UID = '00000000-0000-0000-0000-000000000000';

/**
 * Query parameter for editing secret
 */
export const QUERY_PARAM_EDITING_SECRET = 'secret';

/**
 * Key to identify whether the app is running in Sitecore Preview mode
 */
export const PREVIEW_KEY = 'sc_preview';

/**
 * ID to be used as a marker for a script rendered in XMC Pages
 * Should identify app is in XM Cloud Pages editing mode
 */
export const PAGES_EDITING_MARKER = 'jss-hrz-editing';

/**
 * Default allowed origins for editing requests. This is used to enforce CORS, CSP headers.
 */
export const EDITING_ALLOWED_ORIGINS = ['https://pages.sitecorecloud.io'];

type ExtendedWindow = Window &
  typeof globalThis & {
    [key: string]: unknown;
    Sitecore: {
      PageModes: {
        ChromeManager: {
          resetChromes: () => void;
        };
      };
    };
  };

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
 * Application metadata
 */
export interface Metadata {
  packages: { [key: string]: string };
}

/**
 * Copy of chrome rediscovery contract from Horizon (chrome-rediscovery.contract.ts)
 */
export const ChromeRediscoveryGlobalFunctionName = {
  name: 'Sitecore.Horizon.ResetChromes',
};

/**
 * Static utility class for Sitecore Pages Editor
 */
export class PagesEditor {
  /**
   * Determines whether the current execution context is within a Pages Editor.
   * Pages Editor environment can be identified only in the browser
   * @returns true if executing within a Pages Editor
   */
  static isActive(): boolean {
    if (isServer()) {
      return false;
    }
    // Check for Chromes mode
    const chromesCheck = window.location.search.indexOf('sc_headless_mode=edit') > -1;
    // JSS will render a jss-exclusive script element in Metadata mode to indicate edit mode in Pages
    return chromesCheck || !!window.document.getElementById(PAGES_EDITING_MARKER);
  }
  static resetChromes(): void {
    if (isServer()) {
      return;
    }
    // Reset chromes in Pages
    (window as ExtendedWindow)[ChromeRediscoveryGlobalFunctionName.name] &&
      ((window as ExtendedWindow)[ChromeRediscoveryGlobalFunctionName.name] as () => void)();
  }
}

/**
 * Determines whether the current execution context is within a Sitecore editor.
 * Sitecore Editor environment can be identified only in the browser
 * @returns true if executing within a Sitecore editor
 */
export const isEditorActive = (): boolean => {
  return PagesEditor.isActive();
};

/**
 * Resets Sitecore editor "chromes"
 */
export const resetEditorChromes = (): void => {
  if (PagesEditor.isActive()) {
    PagesEditor.resetChromes();
  }
};

/**
 * Gets extra JSS clientData scripts to render in XMC Pages in addition to clientData from Pages itself
 * @returns {Record} collection of clientData
 */
export const getJssPagesClientData = () => {
  const clientData: Record<string, Record<string, unknown>> = {};
  clientData[PAGES_EDITING_MARKER] = {};

  return clientData;
};
