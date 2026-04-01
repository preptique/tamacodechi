// Build script: compile TS for tests + bundle for distribution
import { build } from 'esbuild'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 1. Compile TypeScript to .js files for tests (using tsc)
console.log('Compiling TypeScript for tests...')
execSync('npx tsc --outDir dist --declaration false --module ESNext --target ES2022 --moduleResolution bundler --noEmit false', {
  cwd: __dirname,
  stdio: 'inherit',
})

// 2. Bundle into single file for distribution
// The SDK uses subpaths (server/mcp, server/stdio) not in the exports map.
// Use alias to point esbuild at the actual files.
console.log('Bundling for distribution...')
const sdkPath = join(__dirname, 'node_modules/@modelcontextprotocol/sdk/dist/esm')
await build({
  entryPoints: ['dist/server.js'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'tamacodechi.js',
  external: [],
  alias: {
    '@modelcontextprotocol/sdk/server/mcp': join(sdkPath, 'server/mcp.js'),
    '@modelcontextprotocol/sdk/server/stdio': join(sdkPath, 'server/stdio.js'),
  },
  minify: false,
})

console.log('Done.')
