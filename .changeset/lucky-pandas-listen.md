---
'@sitecore-content-sdk/core': patch
---

Detect the active package manager from `npm_config_user_agent` (falling back to `npm_execpath`) and use that manager's listing command when collecting Sitecore package metadata, so metadata generation follows the package manager that is running the build.
