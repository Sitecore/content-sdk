import { ImportEntry, ImportEntryInfo } from '@sitecore-content-sdk/core/codegen';
import {
  ComponentFields,
  ComponentParams,
  ComponentRendering,
  RouteData,
} from '@sitecore-content-sdk/core/layout';
import { DesignLibraryStatus } from '@sitecore-content-sdk/core/editing';
import { Page } from '@sitecore-content-sdk/core/client';
import { ComponentPreviewEventArgs } from '@sitecore-content-sdk/core/codegen';
import { ComponentMap } from '../sharedTypes';

export type ImportMapImport = {
  default: ImportEntry[];
};

export type DynamicComponent = React.ComponentType<{
  [key: string]: unknown;
  fields: ComponentFields;
  params: ComponentParams;
}>;

// @MAJOR-RELEASE-TODO - Make loadImportMap required in next major version
export type DesignLibraryProps = {
  /**
   * The dynamic import for import map to be used in variant generation mode.
   * Currently it's optional but it will be required in the next major version.
   */
  loadImportMap?: () => Promise<ImportMapImport>;
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
};

export type DesignLibraryClientProps = {
  /**
   * The dynamic import for client import map to be used in variant generation mode.
   */
  loadClientImportMap?: () => Promise<ImportMapImport>;
};

export type DesingLibraryAppProps = DesignLibraryServerProps & DesignLibraryClientProps;

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
  importMap: ImportEntryInfo[];
  /**
   * Any error that occurred while loading the import map to be posted as a message to the Design Studio.
   */
  importMapError?: string;
  /**
   * The preview component data received from design library.
   */
  previewComponentData?: ComponentPreviewEventArgs;
};
