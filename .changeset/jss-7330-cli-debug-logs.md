---
'@sitecore-content-sdk/cli': patch
---

Fix debug logs not being written by `sitecore-tools` when `DEBUG` is set in an `.env` file. The debug scopes are now enabled through `@sitecore-content-sdk/core`, so they are applied to the same 'debug' instance the SDK packages log through instead of a separate copy of the module the CLI could resolve on its own.
