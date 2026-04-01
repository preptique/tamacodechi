// MCP Server for tamacodechi Phase 2
// 4 tools: buddy status, buddy feed, buddy pet, buddy reset
// Mood system: state persists to ~/.tamacodechi/state.json
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio'
import { loadConfig, getConfigPath } from './config.js'
import { renderSprite } from './sprites.js'
import { companionStatus, companionFeed, companionPet, companionReset } from './responses.js'
import type { Species } from './types.js'
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

function buildFrames(species: Species, frames: number[], eye = '·'): string {
  return frames.map(f => renderSprite(species, f, eye).join('\n')).join('\n\n')
}

function makeResponse(cfg: { species: Species; name: string }, frames: string, text: string): string {
  return `${frames}\n\n> ${text}`
}

function statusFrames(species: Species): string {
  return buildFrames(species, [0, 2])
}

function feedFrames(species: Species): string {
  return buildFrames(species, [0, 1, 2])
}

function petFrames(species: Species): string {
  return buildFrames(species, [0, 1, 2])
}

function resetFrames(species: Species): string {
  return buildFrames(species, [0])
}

const cfg = loadConfig(getConfigPath())
let state = decayMood(loadState())
// Keep pet name from config if state is fresh (no name yet)
if (!state.name || state.name === 'Gravy') {
  state = { ...state, name: cfg.name }
}

const server = new McpServer({
  name: 'tamacodechi',
  version: '0.2.0',
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
    const frames = statusFrames(cfg.species)
    const text = companionStatus(cfg.name, cfg.species, state.mood, mood, state.totalFeeds, state.totalPets)
    return { content: [{ type: 'text', text: makeResponse(cfg, frames, text) }] }
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
    const frames = feedFrames(cfg.species)
    const text = companionFeed(cfg.name, cfg.species, code ?? '', state.mood, mood, state.totalFeeds)
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
    const frames = petFrames(cfg.species)
    const text = companionPet(cfg.name, cfg.species, state.mood, mood, state.totalPets)
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
    const frames = resetFrames(cfg.species)
    const text = companionReset(cfg.name, cfg.species)
    return { content: [{ type: 'text', text: makeResponse(cfg, frames, text) }] }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
