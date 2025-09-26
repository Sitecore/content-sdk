#!/usr/bin/env node

import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { pathToFileURL, fileURLToPath } from 'url';
import { registerTools } from './tools/register.js';
import pingTool from './tools/ping.js';
import listSchemasTool from './tools/listSchemas.js';
import getPageTool from './tools/getPage.js';
import getDictionaryTool from './tools/getDictionary.js';
import getRobotsTool from './tools/getRobots.js';
import getErrorPagesTool from './tools/getErrorPages.js';
import listRoutesTool from './tools/listRoutes.js';
import getSitemapXmlTool from './tools/getSitemapXml.js';
import listComponentsTool from './tools/listComponents.js';
// Resolve MCP SDK imports dynamically to handle version/path differences
/**
 * Load MCP SDK Server and stdio transport constructors with path fallbacks.
 * @returns {Promise<{ Server: any, StdioServerTransport: any }>} constructors
 */
async function loadMcpSdk() {
  const serverCandidates = [
    '@modelcontextprotocol/sdk/server',
    '@modelcontextprotocol/sdk/server/index.js',
    '@modelcontextprotocol/sdk/dist/server/index.js',
    '@modelcontextprotocol/sdk/dist/server.js',
  ];
  const stdioCandidates = [
    '@modelcontextprotocol/sdk/transports/stdio',
    '@modelcontextprotocol/sdk/transports/stdio/index.js',
    '@modelcontextprotocol/sdk/dist/transports/stdio/index.js',
    '@modelcontextprotocol/sdk/dist/transports/stdio.js',
  ];

  let ServerCtor;
  let StdioCtor;

  for (const mod of serverCandidates) {
    try {
      const resolved = require.resolve(mod);
      const m = await import(pathToFileURL(resolved).href);
      ServerCtor = m.Server || m.default || ServerCtor;
      if (ServerCtor) break;
    } catch {
      // ignore
    }
  }
  for (const mod of stdioCandidates) {
    try {
      const resolved = require.resolve(mod);
      const m = await import(pathToFileURL(resolved).href);
      StdioCtor = m.StdioServerTransport || m.default || StdioCtor;
      if (StdioCtor) break;
    } catch {
      // ignore
    }
  }
  if (!ServerCtor || !StdioCtor) {
    throw new Error('Failed to load MCP SDK Server or Stdio transport');
  }
  return { Server: ServerCtor, StdioServerTransport: StdioCtor };
}

// Import Sitecore client from CJS subpath (works under ESM via default export)
/**
 * Load SitecoreClient from workspace package or installed package with fallbacks.
 * @returns {Promise<any | undefined>} SitecoreClient constructor or undefined
 */
async function loadSitecoreClientCtor() {
  const candidates = [
    '@sitecore-content-sdk/core/client',
    '@sitecore-content-sdk/core/client.js',
    // workspace fallbacks
    new URL('../../core/client.js', import.meta.url).href,
    new URL('../../core/dist/cjs/client/index.js', import.meta.url).href,
    new URL('../../core/dist/esm/client/index.js', import.meta.url).href,
  ];
  for (const mod of candidates) {
    try {
      let m;
      if (mod.startsWith('file:')) {
        const fsPath = fileURLToPath(mod);
        m = require(fsPath);
      } else {
        const resolved = (() => {
          try {
            return pathToFileURL(require.resolve(mod)).href;
          } catch {
            return mod;
          }
        })();
        m = await import(resolved);
      }
      const ctor = (m && (m.SitecoreClient || m.default?.SitecoreClient)) || m?.default;
      if (ctor) return ctor;
    } catch {
      // ignore
    }
  }
  return undefined;
}

/**
 * Load DefaultRetryStrategy from core (optional)
 */
async function loadDefaultRetryStrategyCtor() {
  const candidates = [
    '@sitecore-content-sdk/core',
    new URL('../../core/src/index.ts', import.meta.url).href,
    new URL('../../core/dist/cjs/index.js', import.meta.url).href,
    new URL('../../core/dist/esm/index.js', import.meta.url).href,
  ];
  for (const mod of candidates) {
    try {
      let m;
      if (mod.startsWith('file:')) {
        const fsPath = fileURLToPath(mod);
        m = require(fsPath);
      } else {
        const resolved = (() => {
          try {
            return pathToFileURL(require.resolve(mod)).href;
          } catch {
            return mod;
          }
        })();
        m = await import(resolved);
      }
      const ctor = m.DefaultRetryStrategy || m.default?.DefaultRetryStrategy;
      if (ctor) return ctor;
    } catch (err) {
      if (process.env.DEBUG_MCP_IMPORTS) {
        console.warn(
          '[mcp] failed to import DefaultRetryStrategy from',
          mod,
          String(err && err.message ? err.message : err)
        );
      }
    }
  }
  return undefined;
}

/**
 * Create a Sitecore client from environment variables if available.
 * Falls back to undefined when not configured, enabling demo mode.
 */
async function createClientFromEnv() {
  try {
    const SitecoreClient = await loadSitecoreClientCtor();
    const DefaultRetryStrategy = await loadDefaultRetryStrategyCtor();
    if (!SitecoreClient) return undefined;

    const defaultLanguage = process.env.SITECORE_DEFAULT_LANGUAGE || 'en';
    const defaultSite = process.env.SITECORE_DEFAULT_SITE || 'test';

    const edgeContextId = process.env.SITECORE_EDGE_CONTEXT_ID;
    const edgeClientContextId = process.env.SITECORE_EDGE_CLIENT_CONTEXT_ID;
    const edgeUrl = process.env.SITECORE_EDGE_URL;

    const apiHost = process.env.SITECORE_API_HOST;
    const apiKey = process.env.SITECORE_API_KEY;
    const path = process.env.SITECORE_GRAPHQL_PATH;

    const init = {
      defaultLanguage,
      defaultSite,
      api: {},
      retries: DefaultRetryStrategy
        ? { count: 3, retryStrategy: new DefaultRetryStrategy() }
        : { count: 0, retryStrategy: { shouldRetry: () => false } },
      layout: { formatLayoutQuery: null },
      dictionary: { caching: { enabled: true, timeout: 60000 } },
    };

    if (edgeContextId) {
      init.api.edge = {
        contextId: edgeContextId,
        // clientContextId is optional (server-side only)
        clientContextId: edgeClientContextId || undefined,
        edgeUrl,
      };
    } else if (apiHost && apiKey) {
      init.api.local = {
        apiHost,
        apiKey,
        path,
      };
    } else {
      return undefined;
    }

    return new SitecoreClient(init);
  } catch {
    return undefined;
  }
}

/**
 * Serialize data to pretty JSON text for MCP content messages.
 * @param {unknown} value
 */
function jsonText(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

// removed: collectComponentNames (no longer used in CLI path)

/**
 * CLI call mode: run a single tool and output JSON, then exit.
 */
/**
 * CLI call mode: run a single tool and output JSON, then exit.
 * @param {string[]} argv process argv array
 */
async function runCliCall(argv) {
  const cmd = argv[2];
  const tool = argv[3];
  const rawArgs = argv[4] || '{}';
  if (cmd !== 'call' || !tool) {
    console.error('Usage: node index.js call <toolName> <jsonArgs>');
    process.exit(2);
  }

  let args;
  try {
    args = JSON.parse(rawArgs);
  } catch (e) {
    console.error('Invalid JSON args:', e?.message || String(e));
    process.exit(2);
  }

  const client = await createClientFromEnv();

  /** Map tool name to shared tool implementation */
  const toolMap = {
    ping: (ctx) => pingTool(ctx),
    listSchemas: (ctx) => listSchemasTool(ctx),
    getPage: (ctx) => getPageTool(ctx),
    getDictionary: (ctx) => getDictionaryTool(ctx),
    getRobots: (ctx) => getRobotsTool(ctx),
    getErrorPages: (ctx) => getErrorPagesTool(ctx),
    listRoutes: (ctx) => listRoutesTool(ctx),
    getSitemapXml: (ctx) => getSitemapXmlTool(ctx),
    listComponents: (ctx) => listComponentsTool(ctx),
  };

  const impl = toolMap[tool];
  if (!impl) throw new Error(`Unknown tool: ${tool}`);

  try {
    const result = await impl({ client, args });
    console.log(jsonText({ tool, args, result }));
    process.exit(0);
  } catch (e) {
    console.error(jsonText({ tool, args, error: String(e?.message || e) }));
    process.exit(1);
  }
}

/**
 * Entry point: registers tools and connects over stdio transport.
 */
async function main() {
  // CLI call mode
  if (process.argv[2] === 'call') {
    await runCliCall(process.argv);
    return;
  }
  const client = await createClientFromEnv();

  // No self-test path; server always starts

  const { Server, StdioServerTransport } = await loadMcpSdk();
  const server = new Server({
    name: '@sitecore-content-sdk/mcp-server',
    version: '0.1.0',
  });

  // Register tools
  registerTools(server, client);
  // Prompts are disabled for now

  await server.connect(new StdioServerTransport());
}

main().catch((err) => {
  console.error('Error starting MCP server:', err);
  process.exit(1);
});

