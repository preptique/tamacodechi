import { test, describe } from 'node:test'
import assert from 'node:assert'
import {
  loadState,
  decayMood,
  feedMood,
  petMood,
  statusMood,
  resetMood,
  eyeForMood,
  moodLabel,
  type MoodState,
} from './state.js'

describe('state', () => {
  const freshState = (): MoodState => ({
    mood: 50,
    totalFeeds: 0,
    totalPets: 0,
    totalStatuses: 0,
    lastUpdated: Date.now(),
    name: 'Gravy',
  })

  test('eyeForMood returns ^ for mood >= 70', () => {
    assert(eyeForMood(70) === '^')
    assert(eyeForMood(100) === '^')
    assert(eyeForMood(85) === '^')
  })

  test('eyeForMood returns o for mood 30-69', () => {
    assert(eyeForMood(30) === 'o')
    assert(eyeForMood(50) === 'o')
    assert(eyeForMood(69) === 'o')
  })

  test('eyeForMood returns - for mood < 30', () => {
    assert(eyeForMood(0) === '-')
    assert(eyeForMood(15) === '-')
    assert(eyeForMood(29) === '-')
  })

  test('moodLabel returns correct labels', () => {
    assert(moodLabel(95) === 'elated')
    assert(moodLabel(75) === 'happy')
    assert(moodLabel(55) === 'content')
    assert(moodLabel(35) === ' meh')
    assert(moodLabel(20) === 'grumpy')
    assert(moodLabel(5) === 'miserable')
  })

  test('feedMood increases mood and totalFeeds', () => {
    const s = freshState()
    const result = feedMood(s, 150)
    assert(result.totalFeeds === 1)
    assert(result.mood >= s.mood)
  })

  test('feedMood caps mood at 100', () => {
    const s = { ...freshState(), mood: 99 }
    const result = feedMood(s, 500) // would be +5 but capped
    assert(result.mood === 100)
  })

  test('feedMood max +3 per feed', () => {
    const s = freshState()
    const result = feedMood(s, 1000) // +10 but capped at +3
    assert(result.mood === 53) // 50 + 3
  })

  test('petMood increases mood and totalPets', () => {
    const s = freshState()
    const result = petMood(s)
    assert(result.totalPets === 1)
    assert(result.mood === 52) // +2
  })

  test('petMood caps mood at 100', () => {
    const s = { ...freshState(), mood: 99 }
    const result = petMood(s)
    assert(result.mood === 100)
  })

  test('statusMood increases totalStatuses only', () => {
    const s = freshState()
    const result = statusMood(s)
    assert(result.totalStatuses === 1)
    assert(result.mood === s.mood)
  })

  test('resetMood resets mood to 50', () => {
    const s = { ...freshState(), mood: 95, totalFeeds: 20, totalPets: 10 }
    const result = resetMood(s)
    assert(result.mood === 50)
    assert(result.totalFeeds === 20) // stats preserved
    assert(result.totalPets === 10)
  })

  test('decayMood reduces mood over time', () => {
    const s = { ...freshState(), mood: 50, lastUpdated: Date.now() - 2 * 60 * 60 * 1000 } // 2 hours ago
    const result = decayMood(s)
    assert(result.mood < s.mood) // should have decayed
  })

  test('decayMood does not go below 0', () => {
    const s = { ...freshState(), mood: 0, lastUpdated: Date.now() - 10 * 60 * 60 * 1000 } // 10 hours ago
    const result = decayMood(s)
    assert(result.mood === 0)
  })
})
