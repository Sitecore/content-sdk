---
'create-content-sdk-app': major
---

Big refactor to support individual product versioning for `angular`, `nextjs`:
 * Separate templates into individual packages with their own versions. Template package versions share the major verions with their product packages (nextjs, angular)
 * Streamline the scaffolding logic, removing unused types and functions
 * Add an optional `--majorVersion` flag for `create-content-sdk-app` allowing to scaffold a sample for a specific product version. The command will use latest available sample versions when flag is missing
