## Sitecore Content SDK MCP Server (POC)

Concise MCP server exposing Sitecore Content SDK tools and prompts.

### Quick start (one-shot CLI calls)
For current usage we invoke tools via one-shot CLI calls; no persistent server is required.

1) Install deps (repo root):
```bash
yarn install
```
2) Env (create `packages/content-sdk-mcp/.env`):
```bash
# Edge (XM Cloud)
SITECORE_EDGE_CONTEXT_ID=...
SITECORE_EDGE_URL=https://edge-platform.sitecore-staging.cloud

# Local (optional)
# SITECORE_API_HOST=https://cm.localhost
# SITECORE_API_KEY=xxxxx-xxxxx
# SITECORE_GRAPHQL_PATH=/sitecore/api/graph/edge

# Defaults
SITECORE_DEFAULT_LANGUAGE=en
SITECORE_DEFAULT_SITE=test
```
3) Verify with one-shot calls from `packages/content-sdk-mcp`:
```bash
node index.js call ping
node index.js call getPage '{ "path": "/", "site": "test", "locale": "en" }'
```
If you get valid JSON back (not errors), your env is OK.

### Optional: Run as a long-lived stdio server
If you prefer an always-on server for an MCP client, you can start it (optional):
```bash
yarn workspace @sitecore-content-sdk/mcp-server start
```
Leave it running and use your MCP client to call tools.

### Features (tools)
- ping: health check
- listSchemas: show Edge/Local config
- getPage: fetch layout/site/locale for a route
- getDictionary: fetch dictionary phrases
- getRobots: fetch robots.txt
- getErrorPages: fetch 404/500 pages
- listRoutes: list site routes (getPagePaths)
- getSitemapXml: fetch sitemap XML (index or specific)
- listComponents: aggregate component names from layout

CLI examples:
```bash
node index.js call listRoutes '{ "site": "test", "languages": ["en"] }'
node index.js call getSitemapXml '{ "reqHost": "example.com", "reqProtocol": "https", "site": "test" }'
node index.js call listComponents '{ "routes": ["/"], "site": "test", "locale": "en" }'
```

### Prompts (if client supports prompts)
- summarizeContent { content }
- seoDescription { content }
- getPagePrompt { path, site?, locale? }
- listRoutesPrompt { site?, languages?[] }
- getSitemapXmlPrompt { reqHost, reqProtocol, id?, site? }
- getDictionaryPrompt { site?, locale? }
- getRobotsPrompt { site }
- getErrorPagesPrompt { site?, locale? }
- listComponentsPrompt { routes[], site?, locale? }

### Optional: MCP client wiring (Cursor example)
If you need MCP client integration, you can wire the server in your client config. This is not required for one-shot usage.


---

## Appendix A) Packages and installation in this repo

This MCP server relies on:
- @modelcontextprotocol/sdk (MCP SDK)
- dotenv (loads `.env`)
- @sitecore-content-sdk/core (workspace dependency in this monorepo)

These are already declared under `packages/content-sdk-mcp/package.json`. If you ever need to (re)install manually in this monorepo, run from repo root:
```bash
yarn workspace @sitecore-content-sdk/mcp-server add @modelcontextprotocol/sdk dotenv
```

Notes:
- This package is ESM (`"type": "module"`) and requires Node >= 22.
- Start the server with:
```bash
yarn workspace @sitecore-content-sdk/mcp-server start
```

## Appendix B) Tool logic (how they work)

MCP tools are registered with a name and JSON input schema. Each tool returns MCP content messages (we return text JSON strings for readability).

General pattern used in `index.js`:
```js
server.tool(
  {
    name: 'toolName',
    description: 'what it does',
    inputSchema: { type: 'object', properties: { /* inputs */ } }
  },
  async (args) => {
    // 1) Try Sitecore client (configured via .env)
    // 2) Fallback to demo data if no client
    // 3) Return MCP content [{ type: 'text', text: json }]
  }
);
```

What each tool does internally:
- `ping`: no Sitecore call; reports client mode (client/demo)
- `listSchemas`: reads env and returns current Edge/Local endpoints
- `getPage`: calls `SitecoreClient.getPage(path, { site, locale })`
- `getDictionary`: calls `SitecoreClient.getDictionary({ site, locale })`
- `getRobots`: calls `SitecoreClient.getRobots(site)`
- `getErrorPages`: calls `SitecoreClient.getErrorPages({ site, locale })`
- `listRoutes`: calls `SitecoreClient.getPagePaths([site], languages)`
- `getSitemapXml`: calls `SitecoreClient.getSiteMap({ reqHost, reqProtocol, id, siteName })`
- `listComponents`: fetches pages and traverses layout JSON to aggregate `componentName` values


## Appendix C) Build a minimal MCP server from scratch (outside this repo)

If you want to replicate a bare MCP server elsewhere:

1) Create project and init:
```bash
mkdir my-mcp && cd my-mcp
yarn init -y
```
2) Install dependencies:
```bash
yarn add @modelcontextprotocol/sdk dotenv
```
3) package.json:
```json
{
  "type": "module",
  "scripts": { "start": "node ./index.js" }
}
```
4) index.js (hello-world):
```js
#!/usr/bin/env node
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/transports/stdio/index.js';

const server = new Server({ name: 'my-mcp', version: '0.1.0' });
server.tool(
  { name: 'ping', description: 'Health check', inputSchema: { type: 'object' } },
  async () => ({ content: [{ type: 'text', text: 'pong' }] })
);
await server.connect(new StdioServerTransport());
```
5) Start:
```bash
yarn start
```
Then wire to your MCP client with a command pointing to `node index.js`.

