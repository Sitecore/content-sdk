#!/usr/bin/env node
/**
 * Build script for Vercel deployment.
 * Generates the .vercel/output structure required by Vercel's Build Output API.
 *
 * Output structure:
 * .vercel/output/
 *   config.json          - Vercel routing configuration
 *   static/              - Browser assets (from dist/{project}/browser)
 *   functions/
 *     index.func/        - Serverless function
 *       .vc-config.json  - Function configuration
 *       index.mjs        - Function entry point (wrapper)
 *       server/          - Angular server build files
 *       browser/         - Browser files for SSR
 */

import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Angular project name (from angular.json)
const projectName = 'test-anngular21-ssr';

// Paths
const distDir = join(projectRoot, 'dist', projectName);
const browserDir = join(distDir, 'browser');
const serverDir = join(distDir, 'server');
const outputDir = join(projectRoot, '.vercel', 'output');
const staticDir = join(outputDir, 'static');
const functionsDir = join(outputDir, 'functions');
const indexFuncDir = join(functionsDir, 'index.func');

console.log('🔨 Building Angular SSR app for Vercel...\n');

// Step 1: Run Angular production build
console.log('📦 Running Angular production build...');
execSync('npm run build:production', { cwd: projectRoot, stdio: 'inherit' });

// Verify build output exists
if (!existsSync(browserDir) || !existsSync(serverDir)) {
  console.error('❌ Error: Angular build output not found.');
  console.error(`Expected browser files at: ${browserDir}`);
  console.error(`Expected server files at: ${serverDir}`);
  process.exit(1);
}

console.log('✅ Angular build complete.\n');

// Step 2: Clean and create output directory structure
console.log('🗂️  Preparing Vercel output structure...');

if (existsSync(outputDir)) {
  rmSync(outputDir, { recursive: true });
}

mkdirSync(staticDir, { recursive: true });
mkdirSync(indexFuncDir, { recursive: true });

// Step 3: Copy browser files to static directory
console.log('📁 Copying browser assets to static/...');
cpSync(browserDir, staticDir, { recursive: true });

// Step 4: Copy server files to function directory
console.log('📁 Copying server files to function...');
cpSync(serverDir, join(indexFuncDir, 'server'), { recursive: true });

// Also copy browser files to the function directory (needed for SSR)
cpSync(browserDir, join(indexFuncDir, 'browser'), { recursive: true });

// Step 5: Create function entry point (wrapper)
console.log('📝 Creating function entry point...');

const functionEntryPoint = `
/**
 * Vercel Serverless Function entry point.
 * Wraps the Angular SSR Express app for Vercel's serverless environment.
 */
import { reqHandler } from './server/server.mjs';

export default async function handler(request, response) {
  // The Angular server exports a request handler that works with Node.js http.IncomingMessage
  await reqHandler(request, response);
}
`;

writeFileSync(join(indexFuncDir, 'index.mjs'), functionEntryPoint.trim());

// Step 6: Create function configuration
console.log('📝 Creating function configuration...');

const vcConfig = {
  runtime: 'nodejs20.x',
  handler: 'index.mjs',
  launcherType: 'Nodejs',
  shouldAddHelpers: true,
  shouldAddSourceMapSupport: false
};

writeFileSync(join(indexFuncDir, '.vc-config.json'), JSON.stringify(vcConfig, null, 2));

// Step 7: Create Vercel output configuration
console.log('📝 Creating Vercel output configuration...');

const outputConfig = {
  version: 3,
  routes: [
    // Serve static files from browser build
    {
      src: '^/(.+\\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|json|webp|avif))$',
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      continue: true
    },
    // Handle static assets first
    {
      handle: 'filesystem'
    },
    // All other routes go to the SSR function
    {
      src: '/(.*)',
      dest: '/index'
    }
  ]
};

writeFileSync(join(outputDir, 'config.json'), JSON.stringify(outputConfig, null, 2));

console.log('\n✅ Vercel build output ready!');
console.log(`   Output directory: ${outputDir}`);
console.log('\n📂 Output structure:');
console.log('   .vercel/output/');
console.log('   ├── config.json');
console.log('   ├── static/');
console.log('   │   └── (browser assets)');
console.log('   └── functions/');
console.log('       └── index.func/');
console.log('           ├── .vc-config.json');
console.log('           ├── index.mjs');
console.log('           ├── server/');
console.log('           └── browser/');
console.log('\n🚀 Run "vercel deploy --prebuilt" to deploy.\n');
