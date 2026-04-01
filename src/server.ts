// MCP Server for tamacodechi Phase 1
// 4 tools: buddy status, buddy feed, buddy pet, buddy reset
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio'
import { loadConfig, getConfigPath } from './config.js'
import { renderSprite } from './sprites.js'
import { companionStatus, companionFeed, companionPet, companionReset } from './responses.js'
import type { Species } from './types.js'
import * as z from 'zod'

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

const server = new McpServer({
  name: 'tamacodechi',
  version: '0.1.0',
})

// buddy status: no input
server.registerTool(
  'buddy_status',
  {
    title: 'Buddy Status',
    description: 'Get your coding buddy status — animated ASCII pet with a witty quip',
    inputSchema: {},
  },
  async () => {
    const frames = statusFrames(cfg.species)
    const text = companionStatus(cfg.name, cfg.species)
    return { content: [{ type: 'text', text: makeResponse(cfg, frames, text) }] }
  },
)

// buddy feed: takes code string
server.registerTool(
  'buddy_feed',
  {
    title: 'Feed Buddy',
    description: 'Feed your coding buddy some code — watch them chomp it down',
    inputSchema: {
      code: z.string().describe('The code to feed your buddy'),
    },
  },
  async ({ code }) => {
    const frames = feedFrames(cfg.species)
    const text = companionFeed(cfg.name, cfg.species, code ?? '')
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
    const frames = petFrames(cfg.species)
    const text = companionPet(cfg.name, cfg.species)
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
    const frames = resetFrames(cfg.species)
    const text = companionReset(cfg.name, cfg.species)
    return { content: [{ type: 'text', text: makeResponse(cfg, frames, text) }] }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
