// Witty response templates — Phase 2, mood-aware, rarity/hat aware
// 3-5 variants per tool, mood/state affects tone

type StatusFn = (name: string, species: string, mood: number, moodLabel: string, totalFeeds: number, totalPets: number, rarity: string, hat: string) => string
type FeedFn = (name: string, species: string, code: string, mood: number, moodLabel: string, totalFeeds: number, rarity: string, hat: string) => string
type PetFn = (name: string, species: string, mood: number, moodLabel: string, totalPets: number, rarity: string, hat: string) => string
type ResetFn = (name: string, species: string) => string

const STATUS_VARIANTS: StatusFn[] = [
  (name, species, mood, moodLabel, _totalFeeds, _totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` wearing a ${hat}` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    return `${name} the ${species}${hatStr}${rarityStr} is here. Mood: ${moodLabel}. Not doing much. Not not doing much either.`
  },
  (name, species, mood, _moodLabel, _totalFeeds, _totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` with a ${hat}` : ''
    const rarityStr = rarity !== 'common' ? ` (${rarity})` : ''
    return `You rang? ${name} the ${species}${hatStr}${rarityStr} reports for duty. Mood's ${mood}/100. Mostly on time.`
  },
  (name, species, mood, moodLabel, _totalFeeds, _totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? `, ${hat} perched proudly` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    return `${name} on deck${hatStr}. Current mood: ${moodLabel} (${mood}/100)${rarityStr}. What do you need?`
  },
  (name, species, _mood, _moodLabel, _totalFeeds, _totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` (${hat})` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    return `${name} the ${species}${hatStr}${rarityStr} has been summoned. Still here. Still judging.`
  },
  (name, species, mood, moodLabel, _totalFeeds, _totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? `, crowned with a ${hat}` : ''
    const rarityStr = rarity !== 'common' ? ` — ${rarity}` : ''
    return `Your buddy ${name}${hatStr} is present${rarityStr} (${moodLabel}, ${mood}/100). Don't expect enthusiasm.`
  },
]

const FEED_VARIANTS: FeedFn[] = [
  (name, species, code, mood, moodLabel, _totalFeeds, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` (${hat})` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    if (code.length === 0) {
      return `You fed ${name}${hatStr} nothing. Bold choice. Very on-brand for ${species}${rarityStr}.`
    }
    return `Ooh, ${code.length} characters of code. ${name} chomps it down. *munch munch*${rarityStr} (mood: ${moodLabel})`
  },
  (name, species, code, _mood, _moodLabel, _totalFeeds, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` ${hat}` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    if (code.length === 0) {
      return `${name}${hatStr} stares at the empty bowl. The sadness is palpable.`
    }
    return `${code.length} characters? You call that a meal? ... OK fine, ${name}${hatStr} will eat it.${rarityStr}`
  },
  (name, species, code, mood, _moodLabel, _totalFeeds, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` (${hat})` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    if (code.length === 0) {
      return `An empty plate for ${name}${hatStr}. Cruel. But ${species} are resilient.`
    }
    return `Feeding ${name}${hatStr} ${code.length} chars. Mood: ${mood}/100${rarityStr}. Tasty? debatable. Appreciated? yes.`
  },
  (name, species, code, mood, moodLabel, totalFeeds, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` ${hat}` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    if (code.length === 0) {
      return `You tried to feed ${name}${hatStr} emptiness. ${name} feels seen.`
    }
    if (code.length < 200) {
      return `${name}${hatStr} tackles ${code.length} chars. Total feeds: ${totalFeeds}. A proper meal.${rarityStr}`
    }
    return `${name}${hatStr} faces ${code.length} chars of code. A feast. ${species} is overwhelmed.${rarityStr} (${moodLabel}, ${mood}/100)`
  },
  (name, species, code, mood, moodLabel, _totalFeeds, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` (${hat})` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    if (code.length === 0) {
      return `Empty air. ${name}${hatStr} pretends to eat. Believable.`
    }
    return `${code.length} chars consumed. ${name} the ${species}${hatStr} burps politely.${rarityStr} (feeling ${moodLabel})`
  },
]

const PET_VARIANTS: PetFn[] = [
  (name, species, mood, moodLabel, totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` (${hat})` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    return `*happy wiggle* You pets ${name}${hatStr}. Total pets: ${totalPets}. ${name} approves. This is acceptable.${rarityStr} (${moodLabel}, ${mood}/100)`
  },
  (name, species, mood, _moodLabel, _totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` ${hat}` : ''
    const rarityStr = rarity !== 'common' ? ` (${rarity})` : ''
    return `${name}${hatStr} melts into a puddle of ${species}. Best thing that has happened today. Mood: ${mood}/100.`
  },
  (name, species, mood, moodLabel, totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? `, ${hat} askew` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    return `You give ${name}${hatStr} scratches. ${species} purrs. Or whatever ${species} do. Total pets: ${totalPets}.${rarityStr} It's working. (${moodLabel})`
  },
  (name, species, mood, moodLabel, _totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` (${hat})` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    return `${name}${hatStr} is being pet. The ${species} considers this compensation for existing.${rarityStr} (${moodLabel}, ${mood}/100)`
  },
  (name, species, mood, moodLabel, totalPets, rarity, hat) => {
    const hatStr = hat !== 'none' ? ` ${hat}` : ''
    const rarityStr = rarity !== 'common' ? ` [${rarity}]` : ''
    return `*waggles* ${name}${hatStr} enjoys this. ${species} affection level: maximum.${rarityStr} (${moodLabel}, ${mood}/100, pets: ${totalPets})`
  },
]

const RESET_VARIANTS: ResetFn[] = [
  (name) => `*yawn* Fine. ${name} is reset. Fresh start. Don't waste it.`,
  (name) => `Wiping the slate. ${name} is a blank canvas now. Go crazy.`,
  (name) => `Reset complete. ${name} has no memory of your crimes. You're welcome.`,
  (name) => `${name} blinks. Where am I? Who are you? Just kidding. Reset done.`,
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export function companionStatus(
  name: string,
  species: string,
  mood: number,
  moodLabel: string,
  totalFeeds: number,
  totalPets: number,
  rarity: string,
  hat: string,
): string {
  return pick(STATUS_VARIANTS)(name, species, mood, moodLabel, totalFeeds, totalPets, rarity, hat)
}

export function companionFeed(
  name: string,
  species: string,
  code: string,
  mood: number,
  moodLabel: string,
  totalFeeds: number,
  rarity: string,
  hat: string,
): string {
  return pick(FEED_VARIANTS)(name, species, code, mood, moodLabel, totalFeeds, rarity, hat)
}

export function companionPet(
  name: string,
  species: string,
  mood: number,
  moodLabel: string,
  totalPets: number,
  rarity: string,
  hat: string,
): string {
  return pick(PET_VARIANTS)(name, species, mood, moodLabel, totalPets, rarity, hat)
}

export function companionReset(name: string, species: string): string {
  return pick(RESET_VARIANTS)(name, species)
}
