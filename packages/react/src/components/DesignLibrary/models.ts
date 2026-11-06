import {
  DesignLibraryPreviewError,
  GeneratedComponentData,
  ImportEntry,
  ImportEntryInfo,
  ServerComponentPreviewEventArgs,
} from '@sitecore-content-sdk/core/codegen';
import {
  ComponentFields,
  ComponentParams,
  ComponentRendering,
  RouteData,
} from '@sitecore-content-sdk/core/layout';
import { DesignLibraryStatus } from '@sitecore-content-sdk/core/editing';
import { Page } from '@sitecore-content-sdk/core/client';
import { ComponentMap } from '../sharedTypes';

export type ImportMapImport = {
  default: ImportEntry[];
};

export type DynamicComponent = React.ComponentType<{
  [key: string]: unknown;
  fields?: ComponentFields;
  params?: ComponentParams;
}>;

// @MAJOR-RELEASE-TODO - Make loadImportMap required in next major version
export type DesignLibraryProps = {
  /**
   * The dynamic import for import map to be used in variant generation mode.
   * Currently it's optional but it will be required in the next major version.
   */
  loadImportMap?: () => Promise<ImportMapImport>;
};

export type ComponentUpdateModel = {
  /**
   * Unique identifier of the component being updated.
   */
  uid: string;
  /**
   * The updated component rendering data.
   */
  rendering?: ComponentRendering;
  /**
   * The data needed for generated component to be rendered on the server. Required if update event is coming for a generated component in variant generation mode.
   */
  generatedComponentData?: GeneratedComponentData;
};

export type ComponentPreviewModel = {
  /**
   * Unique identifier of the component being updated.
   */
  uid: string;
  /**
   * The data needed for generated component to be rendered on the server
   */
  generatedComponentData?: GeneratedComponentData;
  /**
   * Error message in case fetching generated component data from secured cache endpoint fails.
   */
  error?: string;
};

export type PreviewEventModel = {
  /**
   * Unique identifier of the component being updated.
   */
  uid: string;
  /**
   * The preview component event arguments in variant generation mode.
   */
  args: ServerComponentPreviewEventArgs;
};

/**
 * Server action invoked when Design Studio sends a component update.
 */
export type UpdateComponentAction = (updatedComponent: ComponentUpdateModel) => Promise<void>;

/**
 * Server action invoked when Design Studio sends a generated-component preview.
 */
export type PreviewComponentAction = (
  previewEvent: PreviewEventModel,
  edgeUrl?: string
) => Promise<void>;

/**
 * Optional server actions. Callers that cannot authorize the editing secret omit them,
 * and Design Library client events then no-op.
 */
export type DesignLibraryServerActionProps = {
  /**
   * Overrides the empty default update action.
   */
  updateComponentAction?: UpdateComponentAction;
  /**
   * Overrides the empty default preview action.
   */
  previewComponentAction?: PreviewComponentAction;
};

export type DesignLibraryServerProps = {
  /**
   * Component Map will be used to map Sitecore component names to app implementation
   */
  componentMap: ComponentMap;
  /**
   * Rendering data to be used when rendering the placeholder.
   */
  rendering: ComponentRendering | RouteData;
  /**
   * Page data.
   */
  page: Page;
  /**
   * The dynamic import for sever import map to be used in variant generation mode.
   */
  loadServerImportMap: () => Promise<ImportMapImport>;
} & DesignLibraryServerActionProps;

export type DesingLibraryAppProps = DesignLibraryServerProps;

export type DesignLibraryServerPreviewProps = Omit<DesignLibraryServerProps, 'loadServerImportMap'>;

export type DesignLibraryServerVariantGenerationProps = DesignLibraryServerProps;

export type DesignLibraryPreviewEventsProps = {
  /**
   * The design library status to be posted as a message to the Design Studio.
   */
  designLibraryStatus: DesignLibraryStatus;
  /**
   * The component rendering data that is being edited in the Design Studio.
   */
  component: ComponentRendering;
} & DesignLibraryServerActionProps;

export type DesignLibraryVariantGenerationEventsProps = DesignLibraryPreviewEventsProps & {
  /**
   * The import map info to be posted as a message to the Design Studio.
   */
  importMap?: ImportEntryInfo[];
  /**
   * Any error that occurred during initialization of the component:
   * - importMap error
   * - error fetching the generated component data from secured endpoint
   * - error during generation or rendering of the component on the server side
   */
  componentInitError?: ServerComponentInitError;
  /**
   * The generated component data received from design library.
   */
  generatedComponentData?: GeneratedComponentData;
};

export type ServerComponentInitError = {
  /** The type of error, as defined in DesignLibraryPreviewError. */
  type: DesignLibraryPreviewError;
  /** The error message. */
  message: string;
};
