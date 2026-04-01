# Tamacodechi

A Tamagotchi-style coding companion that lives in your CLI. Summoned via MCP tools.

Feed your code to your pet, pet them, check on them. They have opinions about your variable naming.

## Install (one command)

```bash
npx preptique/tamacodechi install
```

That's it. Restart Claude Code and try `/buddy status`.

### What it does
- Downloads the latest `tamacodechi.js` to `~/.tamacodechi/`
- Registers it as an MCP server with Claude Code
- Handles everything automatically

### 2. Add to Claude Code

Find your `mcp.json`:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add to `mcpServers`:

```json
{
  "mcpServers": {
    "tamacodechi": {
      "command": "node",
      "args": ["/path/to/tamacodechi.js"]
    }
  }
}
```

### 3. Restart Claude Code

Your pet is now available as MCP tools.

## Tools

| Tool | Description |
|------|-------------|
| `buddy_status` | Check on your pet — gets a witty status quip |
| `buddy_feed` | Feed your pet some code — watch them react |
| `buddy_pet` | Pet your pet — receive gratitude |
| `buddy_reset` | Reset your pet — fresh start |

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
npm install
npm run build   # produces tamacodechi.js
npm test       # 22 tests
```

## How It Works

- MCP server over stdio — no cloud, no accounts, your code never leaves your machine
- Template-driven wit — 3-5 response variants per tool, randomly selected
- ASCII sprite animation — all 18 species with 3 fidget frames each
- No state persistence in Phase 1 — each call is independent

## License

MIT
