import { debugNamespace, debugModule } from '@sitecore-content-sdk/core';

const debug = {
  form: debugModule(`${debugNamespace}:form`),
  layout: debugModule(`${debugNamespace}:layout`),
  dictionary: debugModule(`${debugNamespace}:dictionary`),
  editing: debugModule(`${debugNamespace}:editing`),
  sitemap: debugModule(`${debugNamespace}:sitemap`),
  multisite: debugModule(`${debugNamespace}:multisite`),
  robots: debugModule(`${debugNamespace}:robots`),
  redirects: debugModule(`${debugNamespace}:redirects`),
  personalize: debugModule(`${debugNamespace}:personalize`),
  locale: debugModule(`${debugNamespace}:locale`),
  errorpages: debugModule(`${debugNamespace}:errorpages`),
};

export default debug;
