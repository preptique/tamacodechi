// Mood state persistence for tamacodechi Phase 2
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

export type MoodState = {
  mood: number       // 0-100, default 50
  totalFeeds: number
  totalPets: number
  totalStatuses: number
  lastUpdated: number // unix timestamp
  name: string       // pet name, persisted so reset doesn't lose it
  companionUserId?: string // userId used to compute Claude companion bones
}

const DEFAULT_STATE: MoodState = {
  mood: 50,
  totalFeeds: 0,
  totalPets: 0,
  totalStatuses: 0,
  lastUpdated: Date.now(),
  name: 'Gravy',
}

function getStatePath(): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? '/tmp'
  return `${home}/.tamacodechi/state.json`
}

function getDir(): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? '/tmp'
  return `${home}/.tamacodechi`
}

export function loadState(): MoodState {
  const path = getStatePath()
  try {
    if (!existsSync(path)) {
      return { ...DEFAULT_STATE }
    }
    const raw = readFileSync(path, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<MoodState>
    return {
      mood: typeof parsed.mood === 'number' ? Math.max(0, Math.min(100, parsed.mood)) : DEFAULT_STATE.mood,
      totalFeeds: typeof parsed.totalFeeds === 'number' ? parsed.totalFeeds : 0,
      totalPets: typeof parsed.totalPets === 'number' ? parsed.totalPets : 0,
      totalStatuses: typeof parsed.totalStatuses === 'number' ? parsed.totalStatuses : 0,
      lastUpdated: typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : Date.now(),
      name: typeof parsed.name === 'string' && parsed.name.length > 0 ? parsed.name : DEFAULT_STATE.name,
      companionUserId: typeof parsed.companionUserId === 'string' ? parsed.companionUserId : undefined,
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state: MoodState): void {
  const dir = getDir()
  mkdirSync(dir, { recursive: true })
  writeFileSync(getStatePath(), JSON.stringify(state, null, 2))
}

export function decayMood(state: MoodState): MoodState {
  const now = Date.now()
  const elapsed = now - state.lastUpdated
  const hours = elapsed / (1000 * 60 * 60)
  // -1 mood per hour idle, min 0
  const decayed = Math.max(0, state.mood - Math.floor(hours))
  return { ...state, mood: decayed, lastUpdated: now }
}

export function feedMood(state: MoodState, codeLength: number): MoodState {
  // +1 per 100 chars, max +3 per feed
  const gain = Math.min(3, Math.floor(codeLength / 100))
  return {
    ...state,
    mood: Math.min(100, state.mood + gain),
    totalFeeds: state.totalFeeds + 1,
    lastUpdated: Date.now(),
  }
}

export function petMood(state: MoodState): MoodState {
  return {
    ...state,
    mood: Math.min(100, state.mood + 2),
    totalPets: state.totalPets + 1,
    lastUpdated: Date.now(),
  }
}

export function statusMood(state: MoodState): MoodState {
  return {
    ...state,
    totalStatuses: state.totalStatuses + 1,
    lastUpdated: Date.now(),
  }
}

export function resetMood(state: MoodState): MoodState {
  return {
    ...state,
    mood: 50,
    lastUpdated: Date.now(),
  }
}

export function eyeForMood(mood: number): string {
  if (mood >= 70) return '^'   // happy
  if (mood >= 30) return 'o'  // neutral
  return '-'                    // droopy
}

export function moodLabel(mood: number): string {
  if (mood >= 80) return 'elated'
  if (mood >= 70) return 'happy'
  if (mood >= 50) return 'content'
  if (mood >= 30) return ' meh'
  if (mood >= 15) return 'grumpy'
  return 'miserable'
}
