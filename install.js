#!/usr/bin/env node
// One-command install for tamacodechi
// Run: npx preptique/tamacodechi install
import { execSync } from 'child_process'
import { createWriteStream, existsSync, mkdirSync, chmodSync, unlinkSync } from 'fs'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const TAMACODECHI_VERSION = 'latest'
const INSTALL_DIR = join(process.env.HOME ?? '/tmp', '.tamacodechi')
const INSTALL_PATH = join(INSTALL_DIR, 'tamacodechi.js')

async function getLatestVersion() {
  const res = await fetch('https://api.github.com/repos/preptique/tamacodechi/releases/latest')
  if (!res.ok) throw new Error(`GitHub API failed: ${res.status}`)
  const data = await res.json()
  return { version: data.tag_name, url: data.browser_download_url }
}

async function download(url, dest) {
  console.log(`  Downloading ${url.split('/').pop()}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest))
}

function run(cmd, label) {
  console.log(`  ${label}...`)
  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch (e) {
    throw new Error(`${label} failed`)
  }
}

async function main() {
  console.log('\n🍳 Tamacodechi Installer\n')

  // 1. Check prerequisites
  console.log('Checking prerequisites...')
  try {
    execSync('claude --version', { stdio: 'ignore' })
  } catch {
    console.error('  ✗ Claude Code not found. Install it first: https://claude.com/code')
    process.exit(1)
  }
  console.log('  ✓ Claude Code found')

  // 2. Download latest release
  console.log('\nFetching latest release...')
  let version, downloadUrl
  try {
    ({ version, url: downloadUrl } = await getLatestVersion())
    console.log(`  ✓ Version: ${version}`)
  } catch (e) {
    console.warn(`  ⚠ Could not fetch latest version: ${e.message}`)
    console.warn('  Trying local build instead...')
    const localPath = join(__dirname, 'tamacodechi.js')
    if (!existsSync(localPath)) {
      console.error('  ✗ No local tamacodechi.js found. Run `npm run build` first.')
      process.exit(1)
    }
    mkdirSync(INSTALL_DIR, { recursive: true })
    execSync(`cp ${localPath} ${INSTALL_PATH}`)
    chmodSync(INSTALL_PATH, 0o755)
    downloadUrl = null
  }

  if (downloadUrl) {
    mkdirSync(INSTALL_DIR, { recursive: true })
    await download(downloadUrl, INSTALL_PATH)
    chmodSync(INSTALL_PATH, 0o755)
    console.log(`  ✓ Installed to ${INSTALL_PATH}`)
  }

  // 3. Register with Claude Code
  console.log('\nRegistering with Claude Code...')
  try {
    execSync(`claude mcp remove tamacodechi -s local 2>/dev/null`, { stdio: 'ignore' })
  } catch {}

  try {
    run(`claude mcp add tamacodechi -- node "${INSTALL_PATH}"`, 'Adding MCP server')
    console.log('  ✓ Registered as MCP server')
  } catch (e) {
    console.error(`\n  ✗ Registration failed: ${e.message}`)
    console.error('  Try manually: claude mcp add tamacodechi -- node ~/.tamacodechi/tamacodechi.js')
    process.exit(1)
  }

  console.log('\n✅ Installation complete!\n')
  console.log('Restart Claude Code, then try:')
  console.log('  /buddy status')
  console.log('  /buddy pet')
  console.log('  /buddy feed')
  console.log('  /buddy reset\n')
}

main().catch(e => {
  console.error(`\n❌ Install failed: ${e.message}`)
  process.exit(1)
})
