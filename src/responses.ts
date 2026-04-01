// Witty response templates — Phase 2, mood-aware
// 3-5 variants per tool, mood/state affects tone

type StatusFn = (name: string, species: string, mood: number, moodLabel: string, totalFeeds: number, totalPets: number) => string
type FeedFn = (name: string, species: string, code: string, mood: number, moodLabel: string, totalFeeds: number) => string
type PetFn = (name: string, species: string, mood: number, moodLabel: string, totalPets: number) => string
type ResetFn = (name: string, species: string) => string

const STATUS_VARIANTS: StatusFn[] = [
  (name, species, mood, moodLabel) =>
    `${name} the ${species} is here. Mood: ${moodLabel}. Not doing much. Not not doing much either.`,
  (name, species, mood) =>
    `You rang? ${name} the ${species} reports for duty. Mood's ${mood}/100. Mostly on time.`,
  (name, species, mood, moodLabel) =>
    `${name} on deck. Current mood: ${moodLabel} (${mood}/100). What do you need?`,
  (name, species) =>
    `${name} the ${species} has been summoned. Still here. Still judging.`,
  (name, species, mood, moodLabel) =>
    `Your buddy ${name} is present (${moodLabel}, ${mood}/100). Don't expect enthusiasm.`,
]

const FEED_VARIANTS: FeedFn[] = [
  (name, species, code, mood, moodLabel) =>
    code.length === 0
      ? `You fed ${name} nothing. Bold choice. Very on-brand for ${species}.`
      : `Ooh, ${code.length} characters of code. ${name} chomps it down. *munch munch* (mood: ${moodLabel})`,
  (name, species, code) =>
    code.length === 0
      ? `${name} stares at the empty bowl. The sadness is palpable.`
      : `${code.length} characters? You call that a meal? ... OK fine, ${name} will eat it.`,
  (name, species, code, mood) =>
    code.length === 0
      ? `An empty plate for ${name}. Cruel. But ${species} are resilient.`
      : `Feeding ${name} ${code.length} chars. Mood: ${mood}/100. Tasty? debatable. Appreciated? yes.`,
  (name, species, code, mood, moodLabel, totalFeeds) =>
    code.length === 0
      ? `You tried to feed ${name} emptiness. ${name} feels seen.`
      : code.length < 200
        ? `${name} tackles ${code.length} chars. Total feeds: ${totalFeeds}. A proper meal.`
        : `${name} faces ${code.length} chars of code. A feast. ${species} is overwhelmed. (${moodLabel}, ${mood}/100)`,
  (name, species, code, mood, moodLabel) =>
    code.length === 0
      ? `Empty air. ${name} pretends to eat. Believable.`
      : `${code.length} chars consumed. ${name} the ${species} burps politely. (feeling ${moodLabel})`,
]

const PET_VARIANTS: PetFn[] = [
  (name, species, mood, moodLabel, totalPets) =>
    `*happy wiggle* You pets ${name}. Total pets: ${totalPets}. ${name} approves. This is acceptable. (${moodLabel}, ${mood}/100)`,
  (name, species, mood) =>
    `${name} melts into a puddle of ${species}. Best thing that has happened today. Mood: ${mood}/100.`,
  (name, species, mood, moodLabel, totalPets) =>
    `You give ${name} scratches. ${species} purrs. Or whatever ${species} do. Total pets: ${totalPets}. It's working. (${moodLabel})`,
  (name, species, mood, moodLabel) =>
    `${name} is being pet. The ${species} considers this compensation for existing. (${moodLabel}, ${mood}/100)`,
  (name, species, mood, moodLabel, totalPets) =>
    `*waggles* ${name} enjoys this. ${species} affection level: maximum. (${moodLabel}, ${mood}/100, pets: ${totalPets})`,
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
): string {
  return pick(STATUS_VARIANTS)(name, species, mood, moodLabel, totalFeeds, totalPets)
}

export function companionFeed(
  name: string,
  species: string,
  code: string,
  mood: number,
  moodLabel: string,
  totalFeeds: number,
): string {
  return pick(FEED_VARIANTS)(name, species, code, mood, moodLabel, totalFeeds)
}

export function companionPet(
  name: string,
  species: string,
  mood: number,
  moodLabel: string,
  totalPets: number,
): string {
  return pick(PET_VARIANTS)(name, species, mood, moodLabel, totalPets)
}

export function companionReset(name: string, species: string): string {
  return pick(RESET_VARIANTS)(name, species)
}
