---
'@sitecore-content-sdk/angular': major
'@sitecore-content-sdk/content': minor
---

Use CSDK_PUBLIC_DEFAULT_SITE_NAME variable instead of CSDK_PUBLIC_SITECORE_DEFAULT_SITE, aligning names across frameworks
  - When upgrading from your pre-release Angular app, please ensure you use `CSDK_PUBLIC_DEFAULT_SITE_NAME` and `CSDK_PUBLIC_DEFAULT_LANGUAGE` across your deployments
  - Check the updated `env.example` in the latest available Angular sample for the up-to-date list of available environnment variables
