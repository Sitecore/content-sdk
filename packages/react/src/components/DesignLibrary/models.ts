import {
  GeneratedComponentData,
  ImportEntry,
  ImportEntryInfo,
} from '@sitecore-content-sdk/content/codegen';
import {
  ComponentFields,
  ComponentParams,
  ComponentRendering,
  RouteData,
} from '@sitecore-content-sdk/content/layout';
import { DesignLibraryStatus } from '@sitecore-content-sdk/content/editing';
import { Page } from '@sitecore-content-sdk/content/client';
import { ComponentMap } from '../sharedTypes';

export type ImportMapImport = {
  default: ImportEntry[];
};

export type DynamicComponent = React.ComponentType<{
  [key: string]: unknown;
  fields?: ComponentFields;
  params?: ComponentParams;
}>;

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
};

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
};

export type DesignLibraryVariantGenerationEventsProps = DesignLibraryPreviewEventsProps & {
  /**
   * The import map info to be posted as a message to the Design Studio.
   */
  importMap?: ImportEntryInfo[];
  /**
   * Any error that occurred during initialization of the component:
   * - importMap error
   * - error fetching the generated component data from secured endpoint
   * - error during generation of the component on the server side
   */
  componentInitError?: string;
  /**
   * The generated component data received from design library.
   */
  generatedComponentData?: GeneratedComponentData;
};
