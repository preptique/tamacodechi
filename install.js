#!/usr/bin/env node
// One-command install for tamacodechi
// Run: npx preptique/tamacodechi install
import { execSync } from 'child_process'
import { existsSync, mkdirSync, chmodSync } from 'fs'
import { join } from 'path'

const INSTALL_DIR = join(process.env.HOME ?? '/tmp', '.tamacodechi')
const INSTALL_PATH = join(INSTALL_DIR, 'tamacodechi.js')

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

  // 2. Clone/fetch latest from git
  console.log('\nFetching latest from git...')
  const repoDir = join(INSTALL_DIR, 'repo')
  if (existsSync(repoDir)) {
    run(`cd "${repoDir}" && git fetch origin && git checkout main && git pull`, 'Updating repo')
  } else {
    mkdirSync(INSTALL_DIR, { recursive: true })
    run(`git clone https://github.com/preptique/tamacodechi.git "${repoDir}"`, 'Cloning repo')
  }

  // 3. Build
  console.log('\nBuilding...')
  run(`cd "${repoDir}" && npm ci && npm run build`, 'Building tamacodechi.js')

  const built = join(repoDir, 'tamacodechi.js')
  if (!existsSync(built)) {
    console.error('  ✗ Build failed: tamacodechi.js not found')
    process.exit(1)
  }
  mkdirSync(INSTALL_DIR, { recursive: true })
  execSync(`cp "${built}" "${INSTALL_PATH}"`)
  chmodSync(INSTALL_PATH, 0o755)
  console.log(`  ✓ Installed to ${INSTALL_PATH}`)

  // 4. Register with Claude Code
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
  console.log('  /mcp tamacodechi buddy_status')
  console.log('  /mcp tamacodechi buddy_feed --code "let x = 1"')
  console.log('  /mcp tamacodechi buddy_pet')
  console.log('  /mcp tamacodechi buddy_customize --hat crown --rarity epic\n')
}

main().catch(e => {
  console.error(`\n❌ Install failed: ${e.message}`)
  process.exit(1)
})
