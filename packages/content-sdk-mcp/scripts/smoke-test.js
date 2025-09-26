#!/usr/bin/env node
/*
  Smoke-test runner for MCP tools via one-shot CLI calls.
  Uses child_process.spawn to avoid shell quoting issues.
*/

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

function runToolOnce(toolName, argsObject) {
  return new Promise((resolvePromise) => {
    const jsonArg = JSON.stringify(argsObject || {});
    const child = spawn(process.execPath, ['index.js', 'call', toolName, jsonArg], {
      cwd: projectRoot,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => {
      resolvePromise({ toolName, code, stdout, stderr });
    });
  });
}

async function main() {
  const tests = [
    { tool: 'ping', args: {} },
    { tool: 'listSchemas', args: {} },
    { tool: 'getPage', args: { path: '/', site: 'test', locale: 'en' } },
    { tool: 'getDictionary', args: { site: 'test', locale: 'en' } },
    { tool: 'getRobots', args: { site: 'test' } },
    { tool: 'getErrorPages', args: { site: 'test', locale: 'en' } },
    { tool: 'listRoutes', args: { site: 'test', languages: ['en'] } },
    { tool: 'getSitemapXml', args: { reqHost: 'localhost', reqProtocol: 'https' } },
    { tool: 'listComponents', args: { routes: ['/'], site: 'test', locale: 'en' } },
  ];

  let failures = 0;
  for (const { tool, args } of tests) {
    const result = await runToolOnce(tool, args);
    const label = `${tool}`;
    if (result.code === 0) {
      console.log(`OK  ${label}`);
    } else {
      failures += 1;
      console.error(`FAIL ${label}`);
      if (result.stderr) console.error(result.stderr.trim());
      if (result.stdout) console.error(result.stdout.trim());
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} failure(s)`);
    process.exit(1);
  } else {
    console.log('\nAll MCP tool smoke tests passed.');
  }
}

main().catch((err) => {
  console.error('Smoke test runner error:', err && err.stack ? err.stack : String(err));
  process.exit(1);
});
