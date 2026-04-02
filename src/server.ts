// MCP Server for tamacodechi Phase 2
// 4 tools: buddy status, buddy feed, buddy pet, buddy reset
// Mood system: state persists to ~/.tamacodechi/state.json
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio'
import { loadConfig, getConfigPath, saveConfig, loadClaudeCompanion } from './config.js'
import { renderSprite, renderBuddyCard } from './sprites.js'
import { companionStatus, companionFeed, companionPet, companionReset } from './responses.js'
import type { Species, Hat } from './types.js'
import * as z from 'zod'
import {
  loadState,
  saveState,
  decayMood,
  feedMood,
  petMood,
  statusMood,
  resetMood,
  eyeForMood,
  moodLabel,
  type MoodState,
} from './state.js'

function buildFrames(species: Species, frames: number[], eye = '·', hat: Hat = 'none'): string {
  return frames.map(f => renderSprite(species, f, eye, hat).join('\n')).join('\n\n')
}

function makeResponse(cfg: { species: Species; name: string; rarity: string; hat: Hat }, frames: string, text: string): string {
  return `${frames}\n\n> ${text}`
}

function statusFrames(species: Species, eye: string, hat: Hat): string {
  return buildFrames(species, [0, 2], eye, hat)
}

function feedFrames(species: Species, eye: string, hat: Hat): string {
  return buildFrames(species, [0, 1, 2], eye, hat)
}

function petFrames(species: Species, eye: string, hat: Hat): string {
  return buildFrames(species, [0, 1, 2], eye, hat)
}

function resetFrames(species: Species, eye: string, hat: Hat): string {
  return buildFrames(species, [0], eye, hat)
}

let cfg = loadConfig(getConfigPath())
let state = decayMood(loadState())
// Keep pet name from config if state is fresh (no name yet)
if (!state.name || state.name === 'Gravy') {
  state = { ...state, name: cfg.name }
}

const server = new McpServer({
  name: 'tamacodechi',
  version: '0.4.0',
})

// buddy status: no input
server.registerTool(
  'buddy_status',
  {
    title: 'Buddy Status',
    description: 'Check on your coding buddy — animated ASCII pet with a witty quip',
    inputSchema: {},
  },
  async () => {
    state = decayMood(statusMood(state))
    saveState(state)
    const eye = eyeForMood(state.mood)
    const mood = moodLabel(state.mood)
    const companion = loadClaudeCompanion()
    if (companion) {
      const eyeChar = companion.shiny ? '✦' : eye
      const card = renderBuddyCard({
        name: companion.name,
        species: companion.species as Species,
        rarity: companion.rarity,
        hat: companion.hat as Hat,
        mood: state.mood,
        totalFeeds: state.totalFeeds,
        totalPets: state.totalPets,
        totalStatuses: state.totalStatuses,
        eyeChar,
      })
      const text = companionStatus(companion.name, companion.species, state.mood, mood, state.totalFeeds, state.totalPets, companion.rarity, companion.hat)
      return { content: [{ type: 'text', text: `${card}\n\n> ${text}` }] }
    }
    // Fallback to tamacodechi config if no Claude companion
    const card = renderBuddyCard({
      name: cfg.name,
      species: cfg.species,
      rarity: cfg.rarity,
      hat: cfg.hat,
      mood: state.mood,
      totalFeeds: state.totalFeeds,
      totalPets: state.totalPets,
      totalStatuses: state.totalStatuses,
      eyeChar: eye,
    })
    const text = companionStatus(cfg.name, cfg.species, state.mood, mood, state.totalFeeds, state.totalPets, cfg.rarity, cfg.hat)
    return { content: [{ type: 'text', text: `${card}\n\n> ${text}` }] }
  },
)

// buddy feed: takes code string
server.registerTool(
  'buddy_feed',
  {
    title: 'Feed Buddy',
    description: 'Feed your coding buddy some code — watch them react',
    inputSchema: {
      code: z.string().describe('The code to feed your buddy'),
    },
  },
  async ({ code }) => {
    state = feedMood(state, code?.length ?? 0)
    saveState(state)
    const eye = eyeForMood(state.mood)
    const mood = moodLabel(state.mood)
    const frames = feedFrames(cfg.species, eye, cfg.hat)
    const text = companionFeed(cfg.name, cfg.species, code ?? '', state.mood, mood, state.totalFeeds, cfg.rarity, cfg.hat)
    return { content: [{ type: 'text', text: makeResponse(cfg, frames, text) }] }
  },
)

// buddy pet: no input
server.registerTool(
  'buddy_pet',
  {
    title: 'Pet Buddy',
    description: 'Pet your coding buddy — receive gratitude and warm feelings',
    inputSchema: {},
  },
  async () => {
    state = petMood(state)
    saveState(state)
    const eye = eyeForMood(state.mood)
    const mood = moodLabel(state.mood)
    const frames = petFrames(cfg.species, eye, cfg.hat)
    const text = companionPet(cfg.name, cfg.species, state.mood, mood, state.totalPets, cfg.rarity, cfg.hat)
    return { content: [{ type: 'text', text: makeResponse(cfg, frames, text) }] }
  },
)

// buddy reset: no input
server.registerTool(
  'buddy_reset',
  {
    title: 'Reset Buddy',
    description: 'Reset your coding buddy — fresh start, new mood',
    inputSchema: {},
  },
  async () => {
    state = { ...resetMood(state), name: cfg.name }
    saveState(state)
    const eye = eyeForMood(state.mood)
    const frames = resetFrames(cfg.species, eye, cfg.hat)
    const text = companionReset(cfg.name, cfg.species)
    return { content: [{ type: 'text', text: makeResponse(cfg, frames, text) }] }
  },
)

// buddy customize: optional hat and rarity
server.registerTool(
  'buddy_customize',
  {
    title: 'Customize Buddy',
    description: 'Dress up your buddy with a hat and rarity tier',
    inputSchema: {
      hat: z.string().optional().describe('Hat type: none, crown, tophat, propeller, halo, wizard, beanie, tinyduck'),
      rarity: z.string().optional().describe('Rarity tier: common, uncommon, rare, epic, legendary'),
    },
  },
  async ({ hat, rarity }) => {
    const validHats = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck']
    const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary']
    const newHat = hat !== undefined && validHats.includes(hat) ? hat : cfg.hat
    const newRarity = rarity !== undefined && validRarities.includes(rarity) ? rarity : cfg.rarity
    const updatedConfig = { ...cfg, hat: newHat as typeof cfg.hat, rarity: newRarity as typeof cfg.rarity }
    const configPath = getConfigPath()
    saveConfig(updatedConfig, configPath)
    // Re-load config so server uses new values
    const newCfg = loadConfig(configPath)
    Object.assign(cfg, newCfg)
    const eye = eyeForMood(state.mood)
    const frames = statusFrames(cfg.species, eye, cfg.hat)
    const rarityStr = cfg.rarity !== 'common' ? ` [${cfg.rarity}]` : ''
    const hatStr = cfg.hat !== 'none' ? ` wearing a ${cfg.hat}` : ''
    const text = `${cfg.name}${hatStr}${rarityStr} is now styled and ready. Hat: ${cfg.hat}, Rarity: ${cfg.rarity}. Looking good!`
    return { content: [{ type: 'text', text: makeResponse(cfg, frames, text) }] }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
