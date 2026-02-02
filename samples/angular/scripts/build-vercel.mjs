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
 *     _middleware.func/  - Edge Middleware (optional, if middleware.ts exists)
 *       .vc-config.json  - Edge function configuration
 *       index.js         - Middleware entry point
 *     index.func/        - Serverless function
 *       .vc-config.json  - Function configuration
 *       index.mjs        - Function entry point (wrapper)
 *       server/          - Angular server build files
 *       browser/         - Browser files for SSR
 */

import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
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
const middlewareFuncDir = join(functionsDir, '_middleware.func');

// Middleware source paths (check for .ts first, then .js)
const middlewareTsPath = join(projectRoot, 'middleware.ts');
const middlewareJsPath = join(projectRoot, 'middleware.js');
const hasMiddleware = existsSync(middlewareTsPath) || existsSync(middlewareJsPath);
const middlewareSourcePath = existsSync(middlewareTsPath) ? middlewareTsPath : middlewareJsPath;

/**
 * Bundle middleware for Vercel Edge runtime using esbuild.
 * Falls back to basic TypeScript compilation if esbuild is not available.
 */
async function bundleMiddleware() {
  if (!hasMiddleware) {
    return false;
  }

  console.log('📦 Bundling middleware for Edge runtime...');

  try {
    // Try to use esbuild for bundling
    const { build } = await import('esbuild');

    await build({
      entryPoints: [middlewareSourcePath],
      bundle: true,
      outfile: join(middlewareFuncDir, 'index.js'),
      format: 'esm',
      target: 'es2022',
      platform: 'neutral', // Edge runtime is neither node nor browser
      minify: true,
      sourcemap: false,
      // Mark external packages that should not be bundled
      external: [
        '@sitecore-cloudsdk/*',
        '@sitecore-content-sdk/*',
      ],
    });

    console.log('✅ Middleware bundled successfully.');
    return true;
  } catch (esbuildError) {
    // If esbuild is not available, try simple copy with tsc
    console.log('⚠️  esbuild not available, trying TypeScript compilation...');

    try {
      // Create a minimal tsconfig for middleware compilation
      const tsconfigMiddleware = {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          outDir: middlewareFuncDir,
          declaration: false,
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
        },
        include: [middlewareSourcePath],
      };

      const tsconfigPath = join(projectRoot, 'tsconfig.middleware.json');
      writeFileSync(tsconfigPath, JSON.stringify(tsconfigMiddleware, null, 2));

      execSync(`npx tsc --project ${tsconfigPath}`, { cwd: projectRoot, stdio: 'inherit' });

      // Rename output file to index.js
      const compiledName = middlewareSourcePath.endsWith('.ts') ? 'middleware.js' : 'middleware.js';
      const compiledPath = join(middlewareFuncDir, compiledName);
      if (existsSync(compiledPath)) {
        const content = readFileSync(compiledPath, 'utf8');
        writeFileSync(join(middlewareFuncDir, 'index.js'), content);
        rmSync(compiledPath);
      }

      // Clean up temp tsconfig
      rmSync(tsconfigPath);

      console.log('✅ Middleware compiled successfully.');
      return true;
    } catch (tscError) {
      console.error('❌ Failed to compile middleware:', tscError.message);
      console.log('💡 Consider installing esbuild: npm install -D esbuild');
      return false;
    }
  }
}

console.log('🔨 Building Angular SSR app for Vercel...\n');

if (hasMiddleware) {
  console.log('🔍 Detected middleware file:', middlewareSourcePath);
}

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

// Step 5: Build middleware Edge Function (if middleware exists)
let middlewareEnabled = false;
if (hasMiddleware) {
  console.log('📁 Creating middleware Edge Function...');
  mkdirSync(middlewareFuncDir, { recursive: true });

  middlewareEnabled = await bundleMiddleware();

  if (middlewareEnabled) {
    // Create Edge Function configuration for middleware
    const middlewareVcConfig = {
      runtime: 'edge',
      entrypoint: 'index.js',
    };

    writeFileSync(
      join(middlewareFuncDir, '.vc-config.json'),
      JSON.stringify(middlewareVcConfig, null, 2)
    );

    console.log('✅ Middleware Edge Function created.');
  } else {
    // Clean up if bundling failed
    if (existsSync(middlewareFuncDir)) {
      rmSync(middlewareFuncDir, { recursive: true });
    }
    console.log('⚠️  Skipping middleware (bundling failed).');
  }
}

// Step 7: Create function entry point (wrapper)
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

// Step 8: Create function configuration
console.log('📝 Creating function configuration...');

const vcConfig = {
  runtime: 'nodejs20.x',
  handler: 'index.mjs',
  launcherType: 'Nodejs',
  shouldAddHelpers: true,
  shouldAddSourceMapSupport: false
};

writeFileSync(join(indexFuncDir, '.vc-config.json'), JSON.stringify(vcConfig, null, 2));

// Step 9: Create Vercel output configuration
console.log('📝 Creating Vercel output configuration...');

// Build routes configuration
const routes = [
  // Serve static files from browser build with caching headers
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
];

// Add middleware routing if enabled
if (middlewareEnabled) {
  routes.push(
    // Invoke middleware for all non-static routes
    {
      src: '/(.*)',
      middlewarePath: '_middleware',
      continue: true
    }
  );
}

// SSR function route (final destination for all routes)
routes.push({
  src: '/(.*)',
  dest: '/index'
});

const outputConfig = {
  version: 3,
  routes
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
if (middlewareEnabled) {
  console.log('       ├── _middleware.func/');
  console.log('       │   ├── .vc-config.json');
  console.log('       │   └── index.js');
}
console.log('       └── index.func/');
console.log('           ├── .vc-config.json');
console.log('           ├── index.mjs');
console.log('           ├── server/');
console.log('           └── browser/');

if (middlewareEnabled) {
  console.log('\n🔗 Middleware: ENABLED (Edge Runtime)');
} else if (hasMiddleware) {
  console.log('\n⚠️  Middleware: DISABLED (bundling failed)');
} else {
  console.log('\n💡 Tip: Create a middleware.ts file at the project root to enable Edge Middleware.');
}

console.log('\n🚀 Run "vercel deploy --prebuilt" to deploy.\n');
