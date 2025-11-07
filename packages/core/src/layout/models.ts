/**
 * A reply from the Sitecore Layout Service
 * @public
 */
export interface LayoutServiceData {
  sitecore: LayoutServiceContextData & {
    route: RouteData | null;
  };
}

/**
 * Layout Service page state enum
 * @public
 */
export enum LayoutServicePageState {
  Preview = 'preview',
  Edit = 'edit',
  Normal = 'normal',
}

/**
 * Represents the edit mode for rendering content in Sitecore Editors
 * @public
 */
export enum EditMode {
  Metadata = 'metadata',
}

/**
 * Shape of context data from the Sitecore Layout Service
 * @public
 */
export interface LayoutServiceContext {
  [key: string]: unknown;
  pageEditing?: boolean;
  language?: string;
  itemPath?: string;
  pageState?: LayoutServicePageState;
  visitorIdentificationTimestamp?: number;
  site?: {
    name?: string;
  };
  renderingType?: RenderingType;
  clientScripts?: string[];
  clientData?: Record<string, Record<string, unknown>>;
}

/**
 * Context information from the Sitecore Layout Service
 * @public
 */
export interface LayoutServiceContextData {
  context: LayoutServiceContext;
}

/**
 * Shape of route data returned from Sitecore Layout Service
 * @public
 */
export interface RouteData<Fields = Record<string, Field | Item | Item[]>> {
  name: string;
  displayName?: string;
  fields?: Fields;
  databaseName?: string;
  deviceId?: string;
  itemLanguage?: string;
  itemVersion?: number;
  layoutId?: string;
  templateId?: string;
  templateName?: string;
  placeholders: PlaceholdersData;
  itemId?: string;
}

/**
 * Placeholder contents data (name: placeholder name, then array of components within that placeholder name)
 * @public
 */
export type PlaceholdersData<TYPEDNAME extends string = string> = {
  [P in TYPEDNAME]: Array<ComponentRendering>;
};

/**
 * Content field data passed to a component
 * @public
 */
export interface ComponentFields {
  [name: string]: Field | Item | Item[];
}

/**
 * Component params
 * @public
 */
export interface ComponentParams {
  [name: string]: string;
}

/**
 * Definition of a component instance within a placeholder on a route
 * @public
 */
export interface ComponentRendering<T = ComponentFields> {
  componentName: string;
  dataSource?: string;
  uid?: string;
  placeholders?: PlaceholdersData;
  fields?: T;
  params?: ComponentParams;
}

/**
 * Field value data on a component
 * @public
 */
export type GenericFieldValue =
  | string
  | boolean
  | number
  | Date
  | { [key: string]: unknown }
  | Array<{ [key: string]: unknown }>;


/**
 * Field interface
 * @public
 */
export interface Field<T = GenericFieldValue> extends FieldMetadata {
  value: T;
}

/**
 * Field metadata in editing mode
 * @public
 */
export interface FieldMetadata {
  metadata?: { [key: string]: unknown };
}

/**
 * Content data returned from Layout Service
 * @public
 */
export interface Item {
  name: string;
  displayName?: string;
  id?: string;
  url?: string;
  fields: {
    [name: string]: Field | Item | Item[] | undefined;
  };
}

/**
 * Contents of a single placeholder returned from placeholder service
 * @public
 */
export interface PlaceholderData {
  name: string;
  path: string;
  elements: ComponentRendering[];
}

/**
 * Editing rendering type
 * @public
 */
export enum RenderingType {
  Component = 'component',
}

/**
 * Contract for additional route options when requesting layout data
 * @public
 */
export type RouteOptions = {
  site: string;
  locale?: string;
};

/**
 * Static placeholder name used for component rendering
 * @internal
 */
export const EDITING_COMPONENT_PLACEHOLDER = 'editing-componentmode-placeholder';
/**
 * Id of wrapper for component rendering
 * @internal
 */
export const EDITING_COMPONENT_ID = 'editing-component';
