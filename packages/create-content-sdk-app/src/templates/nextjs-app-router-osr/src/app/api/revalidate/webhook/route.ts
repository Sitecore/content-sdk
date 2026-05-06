import { createEdgeWebhookRevalidateRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import { buildSitecoreDictionaryCacheTag, type SiteInfo } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import sites from '.sitecore/sites.json';

const dictionaryTags = Array.from(
  new Set(
    (sites as SiteInfo[])
      .map((site) =>
        buildSitecoreDictionaryCacheTag({
          site: site.name,
          locale: site.language || scConfig.defaultLanguage,
        })
      )
      .concat(
        scConfig.defaultSite
          ? [
              buildSitecoreDictionaryCacheTag({
                site: scConfig.defaultSite,
                locale: scConfig.defaultLanguage,
              }),
            ]
          : []
      )
  )
);

export const { POST } = createEdgeWebhookRevalidateRouteHandler({
  defaultLocale: scConfig.defaultLanguage,
  additionalTags: dictionaryTags,
});
