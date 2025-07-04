import { SitecoreConfig } from '../config/index.js';
import { GraphQLEditingService } from '../editing/graphql-editing-service.js';
import { RestComponentLayoutService } from '../editing/rest-component-layout-service.js';
import { GraphQLDictionaryService } from '../i18n/graphql-dictionary-service.js';
import { GraphQLLayoutService } from '../layout/graphql-layout-service.js';
import {
  GraphQLErrorPagesService,
  GraphQLSitePathService,
  SiteInfo,
  SiteResolver,
} from '../site/index.js';

/**
 * Init options for Sitecore Client that allows you to override services too
 */
export type SitecoreClientInit = Omit<SitecoreConfig, 'multisite' | 'redirects' | 'personalize'> & {
  sites: SiteInfo[];
  custom?: {
    layoutService?: GraphQLLayoutService;
    dictionaryService?: GraphQLDictionaryService;
    siteResolver?: SiteResolver;
    editingService?: GraphQLEditingService;
    errorPagesService?: GraphQLErrorPagesService;
    componentService?: RestComponentLayoutService;
    sitePathService?: GraphQLSitePathService;
  };
};
