import {
  DesignLibraryPreviewError,
  GeneratedComponentData,
  ImportEntryInfo,
} from '@sitecore-content-sdk/content/codegen';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import { DesignLibraryStatus } from '@sitecore-content-sdk/content/editing';
import { Page } from '@sitecore-content-sdk/content/client';
import { ComponentMap, ImportMapImport } from '@sitecore-content-sdk/react';

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
   * When omitted, an empty import map is used (ex: code generation is disabled).
   */
  loadServerImportMap?: () => Promise<ImportMapImport>;
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
