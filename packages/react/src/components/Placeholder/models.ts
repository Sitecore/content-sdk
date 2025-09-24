import { Page } from '@sitecore-content-sdk/core/client';
import { ComponentRendering, Field, Item, RouteData } from '@sitecore-content-sdk/core/layout';
import { ComponentMap } from '../sharedTypes';

type ErrorComponentProps = {
  [prop: string]: unknown;
};

/** Provided for the component which represents rendering data */
export type ComponentProps = {
  [key: string]: unknown;
  rendering: ComponentRendering;
};

export type ComponentType = 'server' | 'client' | 'universal';

export interface PlaceholderProps {
  [key: string]: unknown;
  /** Name of the placeholder to render. */
  name: string;
  /** Rendering data to be used when rendering the placeholder. */
  rendering: ComponentRendering | RouteData;
  /**
   * Component Map will be used to map Sitecore component names to app implementation
   * When rendered within a <SitecoreProvider> component, defaults to the context componentMap.
   * When rendered as a server placeholder, this prop must be provided.
   */
  componentMap?: ComponentMap;
  /**
   * An object of field names/values that are aggregated and propagated through the component tree created by a placeholder.
   * Any component or placeholder rendered by a placeholder will have access to this data via `props.fields`.
   */
  fields?: {
    [name: string]: Field | Item | Item[];
  };
  /**
   * An object of rendering parameter names/values that are aggregated and propagated through the component tree created by a placeholder.
   * Any component or placeholder rendered by a placeholder will have access to this data via `props.params`.
   */
  params?: {
    [name: string]: string;
  };
  /**
   * Modify final props of component (before render) provided by rendering data.
   * Can be used in case when you need to insert additional data into the component.
   * @param {ComponentProps} componentProps component props to be modified
   * @returns {ComponentProps} modified or initial props
   */
  modifyComponentProps?: (componentProps: ComponentProps) => ComponentProps;
  /**
   * A component that is rendered in place of any components that are in this placeholder,
   * but do not have a definition in the componentMap (i.e. don't have a React implementation)
   */
  missingComponentComponent?: React.ComponentClass<unknown> | React.FC<unknown>;

  /**
   * A component that is rendered in place of any components that are hidden
   */
  hiddenRenderingComponent?: React.ComponentClass<unknown> | React.FC<unknown>;

  /**
   * A component that is rendered in place of the placeholder when an error occurs rendering
   * the placeholder
   */
  errorComponent?: React.ComponentClass<ErrorComponentProps> | React.FC<ErrorComponentProps>;
  /**
   * Page data.
   * This data is passed by the SitecoreProvider.
   */
  page: Page;
  /**
   * The message that gets displayed while component is loading
   */
  componentLoadingMessage?: string;
  /**
   * If true, disables Suspense in ErrorBoundary for the placeholder.
   * @default false
   */
  disableSuspense?: boolean;
  /**
   * Render props function that is called when the placeholder contains no content components.
   */
  renderEmpty?: (components: React.ReactNode[]) => React.ReactNode;
  /**
   * Render props function that enables control over the rendering of the components in the placeholder.
   * Useful for techniques like wrapping each child in a wrapper component.
   */
  render?: (
    components: React.ReactNode[],
    data: ComponentRendering[],
    props: PlaceholderProps
  ) => React.ReactNode;

  /**
   * Render props function that is called for each non-system component added to the placeholder.
   * Mutually exclusive with `render`.
   */
  renderEach?: (component: React.ReactNode, index: number) => React.ReactNode;
}

export type RenderedProps = Omit<PlaceholderProps, 'fields | params'> & {
  key: string;
  fields: { [field: string]: unknown };
  params: { [param: string]: unknown };
  rendering: ComponentRendering;
};

/**
 * Prop names from placeholder that cannot be serialized and passed from server to client side components
 */
export const nonSerializedPlaceholderProps = [
  'renderEmpty',
  'render',
  'renderEach',
  'errorComponent',
  'componentLoadingMessage',
  'modifyComponentProps',
  'componentMap',
  'page',
  'missingComponentComponent',
  'hiddenRenderingComponent',
  'rendering',
] as const satisfies (keyof PlaceholderProps)[];
