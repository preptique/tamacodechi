// Config loading — ~/.tamacodechi/config.json with graceful defaults
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import type { BuddyConfig, Species, Hat } from './types.js'

const DEFAULT_CONFIG: BuddyConfig = {
  species: 'duck',
  name: 'Gravy',
  rarity: 'common',
  hat: 'none',
}

const VALID_SPECIES: readonly string[] = [
  'duck', 'goose', 'blob', 'cat', 'dragon', 'octopus', 'owl', 'penguin',
  'turtle', 'snail', 'ghost', 'axolotl', 'capybara', 'cactus', 'robot',
  'rabbit', 'mushroom', 'chonk',
]

const VALID_HATS: readonly string[] = [
  'none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck',
]

const VALID_RARITIES: readonly string[] = ['common', 'uncommon', 'rare', 'epic', 'legendary']

// --- Claude Code companion integration ---
// Replicated from Claude Code's src/buddy/companion.ts for MCP server use

const RARITIES_LIST = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const
const SPECIES_LIST = ['duck', 'goose', 'blob', 'cat', 'dragon', 'octopus', 'owl', 'penguin', 'turtle', 'snail', 'ghost', 'axolotl', 'capybara', 'cactus', 'robot', 'rabbit', 'mushroom', 'chonk'] as const
const EYES_LIST = ['·', '^', 'o', '-', '~', '+'] as const
const HATS_LIST = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck'] as const
const STAT_NAMES_LIST = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK'] as const
const RARITY_WEIGHTS = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 }
const RARITY_FLOOR: Record<string, number> = { common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50 }
const SALT = 'friend-2026-401'

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!
}

function rollCompanionRarity(rng: () => number): string {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0)
  let roll = rng() * total
  for (const rarity of RARITIES_LIST) {
    roll -= RARITY_WEIGHTS[rarity]
    if (roll < 0) return rarity
  }
  return 'common'
}

function rollCompanionStats(rng: () => number, rarity: string): Record<string, number> {
  const floor = RARITY_FLOOR[rarity] ?? 5
  const peak = pick(rng, STAT_NAMES_LIST)
  let dump = pick(rng, STAT_NAMES_LIST)
  while (dump === peak) dump = pick(rng, STAT_NAMES_LIST)
  const stats: Record<string, number> = {}
  for (const name of STAT_NAMES_LIST) {
    if (name === peak) stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30))
    else if (name === dump) stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15))
    else stats[name] = floor + Math.floor(rng() * 40)
  }
  return stats
}

export type ClaudeCompanion = {
  name: string
  personality: string
  hatchedAt: number
  species: string
  rarity: string
  eye: string
  hat: string
  shiny: boolean
  stats: Record<string, number>
}

export function loadClaudeCompanion(overrideUserId?: string): ClaudeCompanion | null {
  try {
    const home = process.env.HOME ?? process.env.USERPROFILE ?? '/tmp'
    const claudePath = `${home}/.claude.json`
    if (!existsSync(claudePath)) return null
    const raw = readFileSync(claudePath, 'utf-8')
    const parsed = JSON.parse(raw) as {
      userID?: string
      companion?: {
        name?: string
        personality?: string
        hatchedAt?: number
        userId?: string
      }
    }
    const stored = parsed.companion
    if (!stored?.hatchedAt) return null
    // Prefer: overrideUserId > stored.companionUserId > stored.userId > config.userID
    const userId = overrideUserId ?? (stored as any).companionUserId ?? stored.userId ?? parsed.userID ?? 'anon'
    const seed = hashString(userId + SALT)
    const rng = mulberry32(seed)
    const rarity = rollCompanionRarity(rng)
    return {
      name: stored.name ?? 'Companion',
      personality: stored.personality ?? 'A mysterious creature.',
      hatchedAt: stored.hatchedAt,
      species: pick(rng, SPECIES_LIST),
      rarity,
      eye: pick(rng, EYES_LIST),
      hat: rarity === 'common' ? 'none' : pick(rng, HATS_LIST),
      shiny: rng() < 0.01,
      stats: rollCompanionStats(rng, rarity),
    }
  } catch {
    return null
  }
}

export function loadConfig(configPath: string): BuddyConfig {
  try {
    if (!existsSync(configPath)) {
      return { ...DEFAULT_CONFIG }
    }
    const raw = readFileSync(configPath, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<BuddyConfig>
    const cfg: BuddyConfig = {
      species: VALID_SPECIES.includes(parsed.species ?? '') ? (parsed.species as Species) : DEFAULT_CONFIG.species,
      name: typeof parsed.name === 'string' && parsed.name.length > 0 ? parsed.name : DEFAULT_CONFIG.name,
      rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(parsed.rarity ?? '') ? (parsed.rarity as BuddyConfig['rarity']) : DEFAULT_CONFIG.rarity,
      hat: VALID_HATS.includes(parsed.hat ?? '') ? (parsed.hat as Hat) : DEFAULT_CONFIG.hat,
    }
    return cfg
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export function getConfigPath(): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? '/tmp'
  return `${home}/.tamacodechi/config.json`
}

export function saveConfig(config: BuddyConfig, configPath: string): void {
  mkdirSync(dirname(configPath), { recursive: true })
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
}
