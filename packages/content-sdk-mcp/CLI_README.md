### MCP CLI quick reference

This guide lists exact commands to run and call the MCP server tools from:
- the MCP package itself (`packages/content-sdk-mcp`)
- a scaffolded app (`samples/nextjs`)

Prereqs
- Node 22+, Yarn
- Env configured in `packages/content-sdk-mcp/.env` (Edge or Local)

Env examples
```bash
# Edge
SITECORE_EDGE_CONTEXT_ID=your_context_id
SITECORE_EDGE_URL=https://edge.sitecorecloud.io
SITECORE_DEFAULT_LANGUAGE=en
SITECORE_DEFAULT_SITE=test

# Local
SITECORE_API_HOST=https://your-sitecore-host
SITECORE_API_KEY=your_api_key
SITECORE_GRAPHQL_PATH=/sitecore/api/graph/edge
SITECORE_DEFAULT_LANGUAGE=en
SITECORE_DEFAULT_SITE=test
```

### From MCP package directory
Run these from `packages/content-sdk-mcp`:

Start stdio server (keeps running):
```bash
node index.js
```

Single-call tools (JSON args required when noted):
```bash
node index.js call ping
node index.js call listSchemas
node index.js call getPage '{ "path": "/", "site": "test", "locale": "en" }'
node index.js call getDictionary '{ "site": "test", "locale": "en" }'
node index.js call getRobots '{ "site": "test" }'
node index.js call getErrorPages '{ "site": "test", "locale": "en" }'
node index.js call listRoutes '{ "site": "test", "languages": ["en"] }'
node index.js call getSitemapXml '{ "reqHost": "example.com", "reqProtocol": "https", "site": "test" }'
node index.js call listComponents '{ "routes": ["/"], "site": "test", "locale": "en" }'
```

### From scaffolded app (samples/nextjs)
Run these from `samples/nextjs`:

Start stdio server via workspace:
```bash
yarn mcp
```

Single-call tools via workspace script:
```bash
yarn mcp:call ping
yarn mcp:call listSchemas
yarn mcp:call getPage '{ "path": "/", "site": "test", "locale": "en" }'
yarn mcp:call getDictionary '{ "site": "test", "locale": "en" }'
yarn mcp:call getRobots '{ "site": "test" }'
yarn mcp:call getErrorPages '{ "site": "test", "locale": "en" }'
yarn mcp:call listRoutes '{ "site": "test", "languages": ["en"] }'
yarn mcp:call getSitemapXml '{ "reqHost": "example.com", "reqProtocol": "https", "site": "test" }'
yarn mcp:call listComponents '{ "routes": ["/"], "site": "test", "locale": "en" }'
```

Notes
- If you see "Sitecore client not configured", verify `.env` in `packages/content-sdk-mcp/`.
- JSON quoting shown above works in PowerShell.

