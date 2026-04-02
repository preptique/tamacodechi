// Inline sprite data — copied from src/buddy/sprites.ts BODIES record
// Each sprite: 5 lines tall, 12 chars wide (after {E} substitution)
// 3 frames per species for fidget animation
import type { Species, Hat } from './types.js'

type Frame = string[]
type Frames = Frame[]

const BODIES: Record<Species, Frames> = {
  duck: [
    ['            ', '    __      ', '  <({E} )___  ', '   (  ._>   ', '    `--´    '],
    ['            ', '    __      ', '  <({E} )___  ', '   (  ._>   ', '    `--´~   '],
    ['            ', '    __      ', '  <({E} )___  ', '   (  .__>  ', '    `--´    '],
  ],
  goose: [
    ['            ', '     ({E}>    ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
    ['            ', '    ({E}>     ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
    ['            ', '     ({E}>>   ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
  ],
  blob: [
    ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (      )  ', '   `----´   '],
    ['            ', '  .------.  ', ' (  {E}  {E}  ) ', ' (        ) ', '  `------´  '],
    ['            ', '    .--.    ', '   ({E}  {E})   ', '   (    )   ', '    `--´    '],
  ],
  cat: [
    ['            ', '   /\\_/\\    ', '  ( {E}   {E})  ', '  (  ω  )   ', '  (")_(")   '],
    ['            ', '   /\\_/\\    ', '  ( {E}   {E})  ', '  (  ω  )   ', '  (")_(")~  '],
    ['            ', '   /\\-/\\    ', '  ( {E}   {E})  ', '  (  ω  )   ', '  (")_(")   '],
  ],
  dragon: [
    ['            ', '  /^\\  /^\\  ', ' <  {E}  {E}  > ', ' (   ~~   ) ', '  `-vvvv-´  '],
    ['            ', '  /^\\  /^\\  ', ' <  {E}  {E}  > ', ' (        ) ', '  `-vvvv-´  '],
    ['   ~    ~   ', '  /^\\  /^\\  ', ' <  {E}  {E}  > ', ' (   ~~   ) ', '  `-vvvv-´  '],
  ],
  octopus: [
    ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  /\\/\\/\\/\\  '],
    ['            ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  \\/\\/\\/\\/  '],
    ['     o      ', '   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  /\\/\\/\\/\\  '],
  ],
  owl: [
    ['            ', '   /\\  /\\   ', '  (({E})({E}))  ', '  (  ><  )  ', '   `----´   '],
    ['            ', '   /\\  /\\   ', '  (({E})({E}))  ', '  (  ><  )  ', '   .----.   '],
    ['            ', '   /\\  /\\   ', '  (({E})(-))  ', '  (  ><  )  ', '   `----´   '],
  ],
  penguin: [
    ['            ', '  .---.     ', '  ({E}>{E})     ', ' /(   )\\    ', '  `---´     '],
    ['            ', '  .---.     ', '  ({E}>{E})     ', ' |(   )|    ', '  `---´     '],
    ['  .---.     ', '  ({E}>{E})     ', ' /(   )\\    ', '  `---´     ', '   ~ ~      '],
  ],
  turtle: [
    ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[______]\\ ', '  ``    ``  '],
    ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[______]\\ ', '   ``  ``   '],
    ['            ', '   _,--._   ', '  ( {E}  {E} )  ', ' /[======]\\ ', '  ``    ``  '],
  ],
  snail: [
    ['            ', ' {E}    .--.  ', '  \\  ( @ )  ', '   \\_`--´   ', '  ~~~~~~~   '],
    ['            ', '  {E}   .--.  ', '  |  ( @ )  ', '   \\_`--´   ', '  ~~~~~~~   '],
    ['            ', ' {E}    .--.  ', '  \\  ( @  ) ', '   \\_`--´   ', '   ~~~~~~   '],
  ],
  ghost: [
    ['            ', '   .----.   ', '  / {E}  {E} \\  ', '  |      |  ', '  ~`~``~`~  '],
    ['            ', '   .----.   ', '  / {E}  {E} \\  ', '  |      |  ', '  `~`~~`~`  '],
    ['    ~  ~    ', '   .----.   ', '  / {E}  {E} \\  ', '  |      |  ', '  ~~`~~`~~  '],
  ],
  axolotl: [
    ['            ', '}~(______)~{', '}~({E} .. {E})~{', '  ( .--. )  ', '  (_/  \\_)  '],
    ['            ', '~}(______){~', '~}({E} .. {E}){~', '  ( .--. )  ', '  (_/  \\_)  '],
    ['            ', '}~(______)~{', '}~({E} .. {E})~{', '  (  --  )  ', '  ~_/  \\_~  '],
  ],
  capybara: [
    ['            ', '  n______n  ', ' ( {E}    {E} ) ', ' (   oo   ) ', '  `------´  '],
    ['            ', '  n______n  ', ' ( {E}    {E} ) ', ' (   Oo   ) ', '  `------´  '],
    ['    ~  ~    ', '  u______n  ', ' ( {E}    {E} ) ', ' (   oo   ) ', '  `------´  '],
  ],
  cactus: [
    ['            ', ' n  ____  n ', ' | |{E}  {E}| | ', ' |_|    |_| ', '   |    |   '],
    ['            ', '    ____    ', ' n |{E}  {E}| n ', ' |_|    |_| ', '   |    |   '],
    [' n        n ', ' |  ____  | ', ' | |{E}  {E}| | ', ' |_|    |_| ', '   |    |   '],
  ],
  robot: [
    ['            ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ ==== ]  ', '  `------´  '],
    ['            ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ -==- ]  ', '  `------´  '],
    ['     *      ', '   .[||].   ', '  [ {E}  {E} ]  ', '  [ ==== ]  ', '  `------´  '],
  ],
  rabbit: [
    ['            ', '   (\\__/)   ', '  ( {E}  {E} )  ', ' =(  ..  )= ', '  (")__(")  '],
    ['            ', '   (|__/)   ', '  ( {E}  {E} )  ', ' =(  ..  )= ', '  (")__(")  '],
    ['            ', '   (\\__/)   ', '  ( {E}  {E} )  ', ' =( .  . )= ', '  (")__(")  '],
  ],
  mushroom: [
    ['            ', ' .-o-OO-o-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
    ['            ', ' .-O-oo-O-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
    ['   . o  .   ', ' .-o-OO-o-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
  ],
  chonk: [
    ['            ', '  /\\    /\\  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------´  '],
    ['            ', '  /\\    /|  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------´  '],
    ['            ', '  /\\    /\\  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------´~ '],
  ],
}

const HAT_LINES: Record<Hat, string> = {
  none: '',
  crown: '   \\^^^/    ',
  tophat: '   [___]    ',
  propeller: '    -+-     ',
  halo: '   (   )    ',
  wizard: '    /^\\     ',
  beanie: '   (___)    ',
  tinyduck: '    ,>      ',
}

export function renderSprite(species: Species, frame = 0, eyeChar = '·', hat: Hat = 'none'): string[] {
  const frames = BODIES[species]
  if (!frames) return [`unknown species: ${species}`]
  const body = frames[frame % frames.length]!.map(line =>
    line.replaceAll('{E}', eyeChar),
  )
  const lines = [...body]
  // Apply hat if configured and line 0 is blank
  if (hat !== 'none' && !lines[0]!.trim()) {
    lines[0] = HAT_LINES[hat] ?? ''
  }
  // Drop blank hat slot if all frames have blank line 0 AND no hat applied
  if (!lines[0]!.trim() && frames.every(f => !f[0]!.trim())) lines.shift()
  return lines
}

export function spriteFrameCount(species: Species): number {
  return BODIES[species]?.length ?? 0
}

function statBar(value: number): string {
  const filled = Math.round(value / 10)
  const empty = 10 - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}

const PERSONALITY_QUOTES = [
  'A companion of few words.',
  'Mostly just vibes here.',
  'Judging your code silently.',
  'Present and accounted for.',
  'Still deciding if it likes you.',
  'Very informative.',
  'Not great at conversational turns.',
  'Mostly correct observations.',
]

export function renderBuddyCard(params: {
  name: string
  species: Species
  rarity: string
  hat: Hat
  mood: number
  totalFeeds: number
  totalPets: number
  totalStatuses: number
  eyeChar: string
  personality?: string
}): string {
  const { name, species, rarity, hat, mood, totalFeeds, totalPets, totalStatuses, eyeChar, personality } = params

  const rarityLabel = rarity.toUpperCase()
  const star = rarity !== 'common' ? '★' : '☆'
  const rarityBar = `${star} ${rarityLabel.padEnd(12)} ${species.toUpperCase().padStart(12)}`

  const spriteLines = renderSprite(species, 0, eyeChar, hat)
  const spriteWidth = 12

  const debugStat = Math.min(totalStatuses * 3, 100)
  const patienceStat = mood
  const chaosStat = Math.max(100 - mood, 0)
  const wisdomStat = Math.min(totalFeeds * 5, 100)
  const snarkStat = Math.min(totalPets * 10, 100)

  const stats = [
    ['DEBUGGING ', debugStat],
    ['PATIENCE ', patienceStat],
    ['CHAOS    ', chaosStat],
    ['WISDOM   ', wisdomStat],
    ['SNARK    ', snarkStat],
  ] as [string, number][]

  const topLine = `╭${'─'.repeat(rarityBar.length + 4)}╮`
  const rarityLine = `│  ${rarityBar}  │`
  const blankLine = `│${' '.repeat(rarityBar.length + 4)}│`
  const spriteLine = (line: string) => `│${line}${' '.repeat(Math.max(0, rarityBar.length + 4 - line.length))}│`
  const nameLine = `│  ${name.padEnd(rarityBar.length + 2)}  │`
  const quoteText = personality ?? PERSONALITY_QUOTES[Math.abs(name.charCodeAt(0) ?? 0) % PERSONALITY_QUOTES.length]
  const quoteLine = `│  "${quoteText}"${' '.repeat(Math.max(0, rarityBar.length - quoteText.length - 1))}  │`
  const statsStart = `│${' '.repeat(rarityBar.length + 4)}│`
  const statLine = (label: string, value: number) =>
    `│  ${label}${statBar(value)}  ${String(value).padStart(3)}           │`
  const bottomLine = `╰${'─'.repeat(rarityBar.length + 4)}╯`

  return [
    topLine,
    rarityLine,
    blankLine,
    ...spriteLines.map(l => spriteLine(`  ${l}`)),
    blankLine,
    nameLine,
    quoteLine,
    blankLine,
    ...stats.map(([label, value]) => statLine(label, value)),
    blankLine,
    bottomLine,
  ].join('\n')
}
