import { test, describe } from 'node:test'
import assert from 'node:assert'
import {
  companionStatus,
  companionFeed,
  companionPet,
  companionReset,
} from './responses.js'

const MOCK_MOOD = 65
const MOCK_MOOD_LABEL = 'content'
const MOCK_TOTAL_FEEDS = 12
const MOCK_TOTAL_PETS = 5
const MOCK_RARITY = 'common'
const MOCK_HAT = 'none'

describe('responses', () => {
  test('companion_status returns 3+ variants', () => {
    const variants = new Set<string>()
    for (let i = 0; i < 100; i++) {
      variants.add(companionStatus('Gravy', 'duck', MOCK_MOOD, MOCK_MOOD_LABEL, MOCK_TOTAL_FEEDS, MOCK_TOTAL_PETS, MOCK_RARITY, MOCK_HAT))
    }
    assert(variants.size >= 3, `status has ${variants.size} variants, want 3+`)
  })

  test('companion_status includes name', () => {
    const r = companionStatus('Butters', 'cat', MOCK_MOOD, MOCK_MOOD_LABEL, 0, 0, MOCK_RARITY, MOCK_HAT)
    assert(r.includes('Butters'), `includes name, got: ${r}`)
  })

  test('companion_status includes mood', () => {
    const r = companionStatus('Gravy', 'duck', 85, 'happy', 10, 3, MOCK_RARITY, MOCK_HAT)
    assert(r.includes('happy') || r.includes('85'), `includes mood info, got: ${r}`)
  })

  test('companion_feed returns 3+ variants', () => {
    const variants = new Set<string>()
    for (let i = 0; i < 100; i++) {
      variants.add(companionFeed('Gravy', 'duck', 'const x = 1', MOCK_MOOD, MOCK_MOOD_LABEL, MOCK_TOTAL_FEEDS, MOCK_RARITY, MOCK_HAT))
    }
    assert(variants.size >= 3, `feed has ${variants.size} variants, want 3+`)
  })

  test('companion_feed handles empty code string', () => {
    const r = companionFeed('Gravy', 'duck', '', MOCK_MOOD, MOCK_MOOD_LABEL, 0, MOCK_RARITY, MOCK_HAT)
    assert(r.length > 0, 'empty code produces response')
    assert(
      r.toLowerCase().includes('empty') || r.includes('0') || r.includes('nothing'),
      `empty code noted in: ${r}`,
    )
  })

  test('companion_feed counts code length correctly', () => {
    const short = companionFeed('Gravy', 'duck', 'x'.repeat(50), MOCK_MOOD, MOCK_MOOD_LABEL, 0, MOCK_RARITY, MOCK_HAT)
    const medium = companionFeed('Gravy', 'duck', 'x'.repeat(250), MOCK_MOOD, MOCK_MOOD_LABEL, 0, MOCK_RARITY, MOCK_HAT)
    assert(short !== medium, `different lengths produce different responses`)
  })

  test('companion_feed includes name', () => {
    const r = companionFeed('Bubbles', 'goose', 'hello world', MOCK_MOOD, MOCK_MOOD_LABEL, 0, MOCK_RARITY, MOCK_HAT)
    assert(r.includes('Bubbles'), `includes name, got: ${r}`)
  })

  test('companion_pet returns 3+ variants', () => {
    const variants = new Set<string>()
    for (let i = 0; i < 100; i++) {
      variants.add(companionPet('Gravy', 'duck', MOCK_MOOD, MOCK_MOOD_LABEL, MOCK_TOTAL_PETS, MOCK_RARITY, MOCK_HAT))
    }
    assert(variants.size >= 3, `pet has ${variants.size} variants, want 3+`)
  })

  test('companion_pet includes name', () => {
    const r = companionPet('Snuggles', 'cat', MOCK_MOOD, MOCK_MOOD_LABEL, 0, MOCK_RARITY, MOCK_HAT)
    assert(r.includes('Snuggles'), `includes name, got: ${r}`)
  })

  test('companion_pet includes mood label', () => {
    const r = companionPet('Gravy', 'duck', 85, 'happy', 0, MOCK_RARITY, MOCK_HAT)
    assert(r.includes('happy') || r.includes('85'), `includes mood, got: ${r}`)
  })

  test('companion_reset returns 3+ variants', () => {
    const variants = new Set<string>()
    for (let i = 0; i < 100; i++) {
      variants.add(companionReset('Gravy', 'duck'))
    }
    assert(variants.size >= 3, `reset has ${variants.size} variants, want 3+`)
  })

  test('companion_reset includes name', () => {
    const r = companionReset('Waffles', 'penguin')
    assert(r.includes('Waffles'), `includes name, got: ${r}`)
  })

  test('companion_status includes rarity when uncommon', () => {
    const r = companionStatus('Gravy', 'duck', MOCK_MOOD, MOCK_MOOD_LABEL, 0, 0, 'uncommon', MOCK_HAT)
    assert(r.includes('uncommon'), `includes rarity, got: ${r}`)
  })

  test('companion_status includes hat when not none', () => {
    const r = companionStatus('Gravy', 'duck', MOCK_MOOD, MOCK_MOOD_LABEL, 0, 0, MOCK_RARITY, 'crown')
    assert(r.includes('crown'), `includes hat, got: ${r}`)
  })
})
