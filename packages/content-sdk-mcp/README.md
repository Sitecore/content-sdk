## Sitecore Content SDK MCP Server (POC)

Demo-ready Model Context Protocol server exposing useful Sitecore Content SDK tools, resources, and prompts.

### Quick start

1) Install deps at repo root:

```bash
yarn install
```

2) Configure env (edge or local). Create `.env` next to `index.js` with any of:

```bash
# Edge (XM Cloud)
SITECORE_EDGE_CONTEXT_ID=
SITECORE_EDGE_CLIENT_CONTEXT_ID=
SITECORE_EDGE_URL=https://edge-platform.sitecorecloud.io

# Local GraphQL
SITECORE_API_HOST=https://cm.localhost
SITECORE_API_KEY=xxxxx-xxxxx
SITECORE_GRAPHQL_PATH=/sitecore/api/graph/edge

# Defaults
SITECORE_DEFAULT_LANGUAGE=en
SITECORE_DEFAULT_SITE=website
```

3) Run server:

```bash
yarn workspace @sitecore-content-sdk/mcp-server start
```

This uses stdio transport, ready to be wired in `mcp.json` for MCP-compatible clients.

### Tools

- `ping`: health check, reports whether Sitecore client is configured
- `getPage`: fetch page details for a route (layout/site/locale)
- `getDictionary`: fetch dictionary phrases
- `getRobots`: fetch robots.txt
- `getErrorPages`: fetch 404/500 page paths
- `listSchemas`: show configured edge/local connection details for debugging

All tools fall back to demo data when env is not configured.

### Prompts

- `summarizeContent`: summarize a content item JSON
- `seoDescription`: generate SEO meta description

### Configure in MCP client (example)

```json
{
  "servers": {
    "Sitecore Content SDK": {
      "type": "stdio",
      "command": "yarn",
      "args": ["workspace", "@sitecore-content-sdk/mcp-server", "start"],
      "env": {
        "SITECORE_DEFAULT_LANGUAGE": "en",
        "SITECORE_DEFAULT_SITE": "website"
      }
    }
  }
}
```


