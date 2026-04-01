// Minimal types for buddy-live Phase 1
// Adapted from src/buddy/types.ts

export const SPECIES = [
  'duck',
  'goose',
  'blob',
  'cat',
  'dragon',
  'octopus',
  'owl',
  'penguin',
  'turtle',
  'snail',
  'ghost',
  'axolotl',
  'capybara',
  'cactus',
  'robot',
  'rabbit',
  'mushroom',
  'chonk',
] as const

export type Species = (typeof SPECIES)[number]

export const EYES = ['·', '^', 'o', '-', '~', '+'] as const
export type Eye = (typeof EYES)[number]

export const HATS = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck'] as const
export type Hat = (typeof HATS)[number]

export type CompanionBones = {
  species: Species
  eye: Eye
  hat: Hat
}

export type BuddyConfig = {
  species: Species
  name: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  hat: Hat
}
