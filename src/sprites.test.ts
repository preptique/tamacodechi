import { test, describe } from 'node:test'
import assert from 'node:assert'
import { renderSprite, spriteFrameCount } from './sprites.js'
import { SPECIES } from './types.js'

describe('sprites', () => {
  test('renderSprite replaces {E} with eye char', () => {
    const out = renderSprite('duck', 0, '^')
    const joined = out.join('')
    assert(!joined.includes('{E}'), `no {E} placeholder left, got: ${joined}`)
  })

  test('all 18 species have 3 frames', () => {
    for (const s of SPECIES) {
      const count = spriteFrameCount(s)
      assert(count === 3, `${s} has ${count} frames, want 3`)
    }
  })

  test('each frame is 4 or 5 lines (blank hat-slot dropped when no hat)', () => {
    for (const s of SPECIES) {
      for (let f = 0; f < 3; f++) {
        const lines = renderSprite(s, f, '·')
        // Frames with all blank line 0 drop that line (hat-slot optimization)
        // This means duck/goose/blob etc get 4 lines when no hat, others stay 5
        assert(lines.length >= 4 && lines.length <= 5, `${s} frame ${f} has ${lines.length} lines, want 4 or 5`)
      }
    }
  })

  test('each line is 12 chars after substitution', () => {
    const eye = '·'
    for (const s of SPECIES) {
      for (let f = 0; f < 3; f++) {
        const lines = renderSprite(s, f, eye)
        for (let l = 0; l < lines.length; l++) {
          assert(lines[l].length === 12, `${s} frame ${f} line ${l} is ${lines[l].length} chars, want 12`)
        }
      }
    }
  })

  test('invalid species returns error string', () => {
    const out = renderSprite('unicorn' as any, 0, '·')
    assert(out[0].includes('unknown species'), 'invalid species handled gracefully')
  })

  test('frame index wraps with modulo', () => {
    const frame0 = renderSprite('duck', 0, '·').join('\n')
    const frame3 = renderSprite('duck', 3, '·').join('\n')
    assert(frame0 === frame3, 'frame 3 should wrap to frame 0')
  })

  test('hat adds line to sprite when hat is not none', () => {
    const withoutHat = renderSprite('duck', 0, '·', 'none')
    const withCrown = renderSprite('duck', 0, '·', 'crown')
    // Hat adds a line at top, so sprite should be taller with hat
    assert(withCrown.length > withoutHat.length, `hat sprite has ${withCrown.length} lines, no-hat has ${withoutHat.length}`)
  })

  test('each hat type renders without error', () => {
    const hats = ['crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck'] as const
    for (const hat of hats) {
      const out = renderSprite('duck', 0, '^', hat)
      const joined = out.join('')
      assert(!joined.includes('{E}'), `hat ${hat} leaves placeholder`)
    }
  })
})
