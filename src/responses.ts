// Witty response templates — Phase 1, no LLM calls
// 3-5 variants per tool, randomly selected

const STATUS_VARIANTS = [
  (name: string, species: string) =>
    `${name} the ${species} is here. Not doing much. Not not doing much either.`,
  (name: string, species: string) =>
    `You rang? ${name} the ${species} reports for duty. Mostly on time.`,
  (name: string, species: string) =>
    `${name} on deck. Current mood: existentially fine.`,
  (name: string, species: string) =>
    `${name} the ${species} has been summoned. What do you need?`,
  (name: string, species: string) =>
    `Your buddy ${name} is present and accounted for. Don't expect enthusiasm.`,
]

const FEED_VARIANTS = [
  // All variants handle empty code as their first branch
  (name: string, species: string, len: number) =>
    len === 0
      ? `You fed ${name} nothing. Bold choice. Very on-brand for ${species}.`
      : `Ooh, ${len} characters of code. ${name} chomps it down. *munch munch*`,
  (name: string, species: string, len: number) =>
    len === 0
      ? `${name} stares at the empty bowl. The sadness is palpable.`
      : `${len} characters? You call that a meal? ... OK fine, ${name} will eat it.`,
  (name: string, species: string, len: number) =>
    len === 0
      ? `An empty plate for ${name}. Cruel. But ${species} are resilient.`
      : `Feeding ${name} ${len} chars of code. Tasty? debatable. Appreciated? yes.`,
  (name: string, species: string, len: number) =>
    len === 0
      ? `You tried to feed ${name} emptiness. ${name} feels seen.`
      : len < 200
        ? `${name} tackles ${len} characters. A proper meal. Satisfying.`
        : `${name} faces ${len} characters of code. This is a feast. ${species} is overwhelmed.`,
  (name: string, species: string, len: number) =>
    len === 0
      ? `Empty air. ${name} pretends to eat. Believable.`
      : `${len} characters consumed. ${name} the ${species} burps politely.`,
]

const PET_VARIANTS = [
  (name: string, species: string) =>
    `*happy wiggle* You pets ${name}. ${name} approves. This is acceptable.`,
  (name: string, species: string) =>
    `${name} melts into a puddle of ${species}. This is the best thing that has happened today.`,
  (name: string, species: string) =>
    `You give ${name} scratches. ${species} purrs. Or whatever ${species} do. It's working.`,
  (name: string, species: string) =>
    `${name} is being pet. The ${species} considers this compensation for existing.`,
  (name: string, species: string) =>
    `*waggles* ${name} enjoys this. ${species} affection level: maximum.`,
]

const RESET_VARIANTS = [
  (name: string) => `*yawn* Fine. ${name} is reset. Fresh start. Don't waste it.`,
  (name: string) => `Wiping the slate. ${name} is a blank canvas now. Go crazy.`,
  (name: string) => `Reset complete. ${name} has no memory of your crimes. You're welcome.`,
  (name: string) => `${name} blinks. Where am I? Who are you? Just kidding. Reset done.`,
]

// Phase 1 doesn't have a species variable accessible in reset, so we need a closure
// that captures species separately
const RESET_VARIANTS_WITH_SPECIES = RESET_VARIANTS.map(fn => (name: string, _species: string) => fn(name))

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export function companionStatus(name: string, species: string): string {
  return pick(STATUS_VARIANTS)(name, species)
}

export function companionFeed(name: string, species: string, code: string): string {
  const len = code.length
  return pick(FEED_VARIANTS)(name, species, len)
}

export function companionPet(name: string, species: string): string {
  return pick(PET_VARIANTS)(name, species)
}

export function companionReset(name: string, species: string): string {
  return pick(RESET_VARIANTS_WITH_SPECIES)(name, species)
}
