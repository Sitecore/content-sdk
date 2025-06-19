import { SitecoreConfig } from '../config';
import { EditingService } from '../editing/editing-service';
import { ComponentLayoutService } from '../editing/component-layout-service';
import { DictionaryService } from '../i18n/dictionary-service';
import { LayoutService } from '../layout/layout-service';
import { ErrorPagesService, SitePathService, SiteInfo, SiteResolver } from '../site';

/**
 * Init options for Sitecore Client that allows you to override services too
 */
export type SitecoreClientInit = Omit<SitecoreConfig, 'multisite' | 'redirects' | 'personalize'> & {
  sites: SiteInfo[];
  custom?: {
    layoutService?: LayoutService;
    dictionaryService?: DictionaryService;
    siteResolver?: SiteResolver;
    editingService?: EditingService;
    errorPagesService?: ErrorPagesService;
    componentService?: ComponentLayoutService;
    sitePathService?: SitePathService;
  };
};
