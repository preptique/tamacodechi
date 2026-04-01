// Config loading — ~/.tamacodechi/config.json with graceful defaults
import { readFileSync, existsSync } from 'fs'
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
