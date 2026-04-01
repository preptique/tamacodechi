# Tamacodechi

A Tamagotchi-style coding companion that lives in your CLI. Summoned via MCP tools.

Feed your code to your pet, pet them, check on them. They have opinions about your variable naming.

## Install

```bash
npx preptique/tamacodechi install
```

That's it. Restart Claude Code and try `/buddy status`.

The install script downloads the latest `tamacodechi.js`, registers it as an MCP server with Claude Code, and handles everything automatically.

## Tools

| Tool | Description |
|------|-------------|
| `/buddy status` | Check on your pet — gets a witty status quip |
| `/buddy feed` | Feed your pet some code — watch them react |
| `/buddy pet` | Pet your pet — receive gratitude |
| `/buddy reset` | Reset your pet — fresh start |

## Customize

Create `~/.tamacodechi/config.json`:

```json
{
  "species": "cat",
  "name": "Mittens"
}
```

Valid species: `duck`, `goose`, `blob`, `cat`, `dragon`, `octopus`, `owl`, `penguin`, `turtle`, `snail`, `ghost`, `axolotl`, `capybara`, `cactus`, `robot`, `rabbit`, `mushroom`, `chonk`

## Build from Source

```bash
git clone https://github.com/preptique/tamacodechi.git
cd tamacodechi
npm install
npm run build
npm test
```

## How It Works

- MCP server over stdio — no cloud, no accounts, your code never leaves your machine
- Template-driven wit — 3-5 response variants per tool, randomly selected
- ASCII sprite animation — all 18 species with 3 fidget frames each
- No state persistence in Phase 1 — each call is independent

## Uninstall

```bash
claude mcp remove tamacodechi -s local
rm -rf ~/.tamacodechi
```

## License

MIT
