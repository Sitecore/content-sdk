import { SitecoreConfig } from '../config';
import { GraphQLEditingService } from '../editing/graphql-editing-service';
import { RestComponentLayoutService } from '../editing/rest-component-layout-service';
import { GraphQLDictionaryService } from '../i18n/graphql-dictionary-service';
import { GraphQLLayoutService } from '../layout/graphql-layout-service';
import { GraphQLErrorPagesService, GraphQLSitePathService, SiteInfo, SiteResolver } from '../site';

/**
 * Init options for Sitecore Client that allows you to override services too
 */
export type SitecoreClientInit = Omit<SitecoreConfig, 'multisite' | 'redirects' | 'personalize'> & {
  sites: SiteInfo[];
  layoutService?: GraphQLLayoutService;
  dictionaryService?: GraphQLDictionaryService;
  siteResolver?: SiteResolver;
  editingService?: GraphQLEditingService;
  errorPagesService?: GraphQLErrorPagesService;
  componentService?: RestComponentLayoutService;
  sitePathService?: GraphQLSitePathService;
};
